import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location'; 
import styles from './style'; 
import { MaterialIcons } from '@expo/vector-icons'; 

import { auth, db } from '../../../firebaseConfig';
import { doc, onSnapshot, updateDoc, setDoc, collection, query, where, serverTimestamp } from 'firebase/firestore';

const INITIAL_REGION = {
  latitude: -23.550520,
  longitude: -46.633308,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

// --- Funções Auxiliares de Cálculo (Haversine) ---
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Raio da Terra em metros
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
// -------------------------------------------------

export default function LocationScreen() {
  const mapRef = useRef(null); 
  const [userData, setUserData] = useState(null); 
  const [connectedUserData, setConnectedUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  const [tagIdInput, setTagIdInput] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [addressText, setAddressText] = useState("Aguardando localização..."); 
  const [lastUpdated, setLastUpdated] = useState(""); 

  const [geofenceCenter, setGeofenceCenter] = useState(null);
  const [geofenceRadius, setGeofenceRadius] = useState(100);
  const [isSavingGeofence, setIsSavingGeofence] = useState(false);
  const [isEditingGeofence, setIsEditingGeofence] = useState(false);

  // NOVO: Estado de Segurança Local
  const [statusSeguranca, setStatusSeguranca] = useState("DENTRO"); // "DENTRO" | "FORA"

  const userUID = auth.currentUser?.uid;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') setAddressText("Permissão de localização negada");
    })();
  }, []);

  useEffect(() => {
    if (!userUID) return;
    const docRef = doc(db, 'users', userUID);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) setUserData(docSnap.data());
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userUID]);

  useEffect(() => {
    if (userData?.usuarioConectado) {
      const connectedUserUID = userData.usuarioConectado;
      const userDocRef = doc(db, 'users', connectedUserUID);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) setConnectedUserData(docSnap.data());
      });
      return () => unsubscribe();
    }
  }, [userData]); 

  useEffect(() => {
    if (userData?.usuarioConectado) {
      const connectedUserUID = userData.usuarioConectado;
      const locationDocRef = doc(db, 'locations', connectedUserUID);
      const unsubscribe = onSnapshot(locationDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLocationData(data);
          
          if (data.timestamp) { 
             const date = data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
             setLastUpdated(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }

          try {
            const addressResponse = await Location.reverseGeocodeAsync({
              latitude: data.latitude,
              longitude: data.longitude
            });
            if (addressResponse.length > 0) {
              const addr = addressResponse[0];
              const street = addr.street || 'Rua desconhecida';
              const number = addr.streetNumber ? `, nº ${addr.streetNumber}` : '';
              const district = addr.subregion || addr.district || '';
              setAddressText(`${street}${number} - ${district}`);
            }
          } catch (error) {}
        } else {
          setLocationData(null);
          setAddressText("Aguardando sinal do localizador...");
        }
      });
      return () => unsubscribe();
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.usuarioConectado) {
      const geofenceDocRef = doc(db, 'geofences', userData.usuarioConectado);
      const unsubscribe = onSnapshot(geofenceDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const { center, radius } = docSnap.data();
          setGeofenceCenter(center);
          setGeofenceRadius(radius);
        }
      });
      return () => unsubscribe();
    }
  }, [userData]);

  // --- NOVO: MONITORAMENTO LOCAL DA CERCA ---
  useEffect(() => {
    if (locationData && geofenceCenter && geofenceRadius) {
        const distancia = getDistanceFromLatLonInMeters(
            locationData.latitude,
            locationData.longitude,
            geofenceCenter.latitude,
            geofenceCenter.longitude
        );

        // Se a distância for maior que o raio, está FORA
        if (distancia > geofenceRadius) {
            setStatusSeguranca("FORA");
        } else {
            setStatusSeguranca("DENTRO");
        }
    }
  }, [locationData, geofenceCenter, geofenceRadius]);

  /* // --- DESATIVADO: OUVINTE DE ALERTAS DO BANCO ---
  // Comentado para evitar travamento do App devido ao excesso de notificações
  useEffect(() => {
    if (userData?.usuarioConectado) {
      const alertsRef = collection(db, 'alerts');
      const q = query(alertsRef, where("userId", "==", userData.usuarioConectado), where("read", "==", false));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
             // Alert.alert(...)
          }
        });
      });
      return () => unsubscribe();
    }
  }, [userData]); 
  */

  const handleCenterMap = () => {
    if (locationData && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    } else {
      Alert.alert("Aviso", "Nenhuma localização disponível.");
    }
  };

  const handleSaveGeofence = async () => {
    if (!geofenceCenter) { Alert.alert("Erro", "Toque no mapa para definir o centro."); return; }
    const connectedUserUID = userData?.usuarioConectado;
    if (!connectedUserUID) return;
    setIsSavingGeofence(true);
    try {
      await setDoc(doc(db, 'geofences', connectedUserUID), {
        center: geofenceCenter,
        radius: geofenceRadius,
        updatedAt: serverTimestamp(),
      });
      Alert.alert("Sucesso", "Área segura atualizada!");
      setIsEditingGeofence(false); 
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar área segura.");
    } finally { setIsSavingGeofence(false); }
  };

  const handleSaveTagId = async () => {
      if (tagIdInput.length < 3) return;
      const connectedUserUID = userData?.usuarioConectado;
      const userDocRef = doc(db, 'users', connectedUserUID);
      await updateDoc(userDocRef, { tagId: tagIdInput });
      setTagIdInput("");
      Alert.alert("Sucesso", "Tag vinculada.");
  };

  if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size="large" color="#2B6FD6" /></View>;

  const currentTagId = connectedUserData?.tagId || "Não configurado";
  const mapRegion = locationData ? {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    } : INITIAL_REGION;

  // Define cores e textos baseados no status
  const statusColor = statusSeguranca === "FORA" ? "#FF4540" : "#4CAF50"; 
  const statusText = statusSeguranca === "FORA" ? "⚠️ FORA DA ÁREA SEGURA" : "✅ DENTRO DA ÁREA SEGURA";

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
          <Text style={styles.title}>Monitoramento</Text>
          <Text style={styles.statusText}>
             Conectado a: {connectedUserData?.nome || 'Usuário'} • {lastUpdated || '--:--'}
          </Text>
        </View>

        {/* --- BARRA DE STATUS VISUAL (NOVA) --- */}
        {!isEditingGeofence && geofenceCenter && (
            <View style={{
                backgroundColor: statusColor, 
                padding: 12, 
                borderRadius: 15, 
                marginBottom: 15,
                alignItems: 'center',
                elevation: 3
            }}>
                <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 16}}>
                    {statusText}
                </Text>
            </View>
        )}

        <View style={[styles.mapCard, { borderWidth: !isEditingGeofence && geofenceCenter ? 3 : 0, borderColor: statusColor }]}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={!isEditingGeofence ? mapRegion : undefined}
            onPress={(e) => {
               if (isEditingGeofence) setGeofenceCenter(e.nativeEvent.coordinate);
            }}
          >
             {locationData && (
               <Marker coordinate={locationData} title="Usuário">
                  <View style={{backgroundColor: 'blue', padding: 5, borderRadius: 20, borderWidth: 2, borderColor: 'white'}}>
                      <MaterialIcons name="person-pin" size={24} color="white" />
                  </View>
               </Marker>
             )}
             {geofenceCenter && (
               <>
                 <Circle center={geofenceCenter} radius={geofenceRadius} strokeColor={statusColor} fillColor={statusSeguranca === "FORA" ? "rgba(255, 69, 64, 0.2)" : "rgba(76, 175, 80, 0.2)"} />
                 {isEditingGeofence && <Marker coordinate={geofenceCenter} pinColor="green" />}
               </>
             )}
          </MapView>
        </View>

        {!isEditingGeofence ? (
          <>
              <TouchableOpacity style={[styles.actionButton, styles.btnBlue]} onPress={handleCenterMap}>
                  <Text style={styles.btnTextBlue}>Centralizar no Usuário</Text>
              </TouchableOpacity>
              
              <Text style={styles.sectionTitle}>Última Posição Conhecida:</Text>
              <View style={styles.infoCard}>
                  <Text style={styles.infoText}>{addressText}</Text>
              </View>

              <Text style={styles.sectionTitle}>Configuração</Text>
              <View style={styles.tagCard}>
                   <Image source={require('../../../assets/icon/bluetooth-icon.png')} style={styles.tagIcon} resizeMode="contain"/>
                   <Text style={styles.tagText}>Tag: {currentTagId}</Text>
              </View>
              
              <TouchableOpacity 
                  style={[styles.actionButton, styles.btnGreen, {marginTop: 10, marginBottom: 20}]}
                  onPress={() => {
                      if (geofenceCenter) {
                          mapRef.current.animateToRegion({ ...geofenceCenter, latitudeDelta: 0.01, longitudeDelta: 0.01 });
                      }
                      setIsEditingGeofence(true);
                  }}
              >
                  <Text style={styles.btnTextGreen}>Configurar Área Segura</Text>
              </TouchableOpacity>
          </>
        ) : (
          <View>
             <Text style={[styles.SecAreaTxt, {textAlign:'center', marginTop: 10}]}>Toque no mapa para definir o centro da área segura</Text>
            <View style={styles.sliderContainer}>
                <Text style={[styles.SecAreaTxt, {textAlign:'center'}]}>Raio da Área: {Math.round(geofenceRadius)}m</Text>
                <Slider
                  style={{width: '100%', height: 30}}
                  minimumValue={50} maximumValue={1000} step={10}
                  value={geofenceRadius} onValueChange={setGeofenceRadius}
                  minimumTrackTintColor="#2B6FD6" maximumTrackTintColor="#2B6FD6"
                  thumbTintColor='#2B6FD6'
                />
                <TouchableOpacity style={[styles.actionButton, styles.btnBlue, {marginTop: 10}]} onPress={handleSaveGeofence}>
                    <Text style={styles.btnTextBlue}>{isSavingGeofence ? "Salvando..." : "Salvar Área Segura"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => setIsEditingGeofence(false)}>
                    <Text style={{color: '#FF4540', fontWeight:'bold'}}>Cancelar</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Vincular Nova Tag</Text>
            <View style={styles.tagCard}>
              <TextInput
                    placeholder="ID da Tag (ex: TAG-123)"
                    value={tagIdInput}
                    onChangeText={setTagIdInput}
                    style={styles.inputSimple}
                    placeholderTextColor="#d7e8fcff"
                />
            </View>
            {tagIdInput.length > 0 && (
                  <TouchableOpacity style={[styles.actionButton, styles.btnBlue]} onPress={handleSaveTagId}>
                      <Text style={styles.btnTextBlue}>Salvar Tag</Text>
                  </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}