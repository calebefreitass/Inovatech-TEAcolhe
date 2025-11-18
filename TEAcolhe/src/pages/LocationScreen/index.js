import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text,TextInput,Button, ScrollView, TouchableOpacity, Alert, ActivityIndicator,KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location'; 
import styles from './style'; 
import { MaterialIcons } from '@expo/vector-icons'; 

import { auth, db } from '../../../firebaseConfig';
import { 
  doc, onSnapshot, updateDoc, setDoc,
  collection, query, where, getDocs, writeBatch,
  serverTimestamp 
} from 'firebase/firestore';

const INITIAL_REGION = {
  latitude: -23.550520,
  longitude: -46.633308,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

export default function MainScreen() {
  const mapRef = useRef(null); 
  const [userData, setUserData] = useState(null); 
  const [connectedUserData, setConnectedUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  
  const [tagIdInput, setTagIdInput] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [addressText, setAddressText] = useState("Aguardando localização..."); 
  const [lastUpdated, setLastUpdated] = useState(""); 

  const [geofenceCenter, setGeofenceCenter] = useState(null);
  const [geofenceRadius, setGeofenceRadius] = useState(100);
  const [isSavingGeofence, setIsSavingGeofence] = useState(false);
  const [isEditingGeofence, setIsEditingGeofence] = useState(false);

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
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        if (data.tipo === 'USUARIO_TEA' && !data.tutorConectado && !data.codigoConvite) {
          const novoCodigo = Math.random().toString(36).substring(2, 8).toUpperCase();
          updateDoc(docRef, { codigoConvite: novoCodigo });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userUID]);

  useEffect(() => {
    if (userData?.tipo === 'TUTOR' && userData?.usuarioConectado) {
      const connectedUserUID = userData.usuarioConectado;
      const userDocRef = doc(db, 'users', connectedUserUID);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) setConnectedUserData(docSnap.data());
      });
      return () => unsubscribe();
    }
  }, [userData]); 

  useEffect(() => {
    if (userData?.tipo === 'TUTOR' && userData?.usuarioConectado) {
      const connectedUserUID = userData.usuarioConectado;
      const locationDocRef = doc(db, 'locations', connectedUserUID);
      const unsubscribe = onSnapshot(locationDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLocationData(data);
          if (data.timestamp) {
            const date = data.timestamp.toDate();
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
              const city = addr.city || '';
              setAddressText(`${street}${number} - ${district}, ${city}`);
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
    if (userData?.tipo === 'TUTOR' && userData?.usuarioConectado) {
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

  useEffect(() => {
    if (userData?.tipo === 'TUTOR' && userData?.usuarioConectado) {
      const alertsRef = collection(db, 'alerts');
      const q = query(alertsRef, where("userId", "==", userData.usuarioConectado), where("read", "==", false));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const alertData = change.doc.data();
            Alert.alert("⚠️ ALERTA DE SEGURANÇA ⚠️", alertData.message || "O usuário saiu da área segura!", [
                { text: "Entendi", onPress: async () => { await updateDoc(change.doc.ref, { read: true }); }}
            ]);
          }
        });
      });
      return () => unsubscribe();
    }
  }, [userData]);

  const handleCenterMap = () => {
    if (locationData && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    } else {
      Alert.alert("Aviso", "Nenhuma localização disponível para centralizar.");
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

  const handleLinkCode = async () => {
    if (inviteCodeInput.length < 6) { Alert.alert("Erro", "O código deve ter 6 caracteres."); return; }
    setIsLinking(true);
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("codigoConvite", "==", inviteCodeInput.toUpperCase()), where("tipo", "==", "USUARIO_TEA"));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) { Alert.alert("Erro", "Nenhum usuário encontrado."); setIsLinking(false); return; }
        const userToLinkDoc = querySnapshot.docs[0];
        const userToLinkUID = userToLinkDoc.id;
        const batch = writeBatch(db);
        batch.update(doc(db, 'users', userUID), { usuarioConectado: userToLinkUID });
        batch.update(doc(db, 'users', userToLinkUID), { tutorConectado: userUID, codigoConvite: null });
        await batch.commit();
        Alert.alert("Sucesso!", "Conectado!");
    } catch (error) { Alert.alert("Erro", "Falha na conexão."); }
    finally { setIsLinking(false); }
  };

  if (loading || !userData) {
    return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size="large" color="#2B6FD6" /></View>;
  }

  // ===== VISÃO DO TUTOR =====
  if (userData.tipo === 'TUTOR') {
    if (userData.usuarioConectado) {
      const currentTagId = connectedUserData?.tagId || "Não configurado";
      const mapRegion = locationData ? {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        } : INITIAL_REGION;

      return (
        // 2. KeyboardAvoidingView ENVOLVENDO O SCROLLVIEW
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            
            <View style={styles.header}>
              <Text style={styles.title}>Localização</Text>
              <TextInput 
                  style={styles.searchBar} 
                  placeholder="Pesquisar"
                  placeholderTextColor="#d7e8fcff"
                  
              />
              <Text style={styles.statusText}>
                 Conectado • Atualizado às {lastUpdated || '--:--'}
              </Text>
            </View>

            <View style={styles.mapCard}>
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
                     <Circle center={geofenceCenter} radius={geofenceRadius} strokeColor="rgba(46, 125, 50, 0.5)" fillColor="rgba(76, 175, 80, 0.2)" />
                     {isEditingGeofence && <Marker coordinate={geofenceCenter} pinColor="green" />}
                   </>
                 )}
              </MapView>
            </View>

            {!isEditingGeofence ? (
              <>
                  <TouchableOpacity style={[styles.actionButton, styles.btnBlue]} onPress={handleCenterMap}>
                      <Text style={styles.btnTextBlue}>Localizar</Text>
                  </TouchableOpacity>
                  <Text style={styles.sectionTitle}>Localização Atual:</Text>
                  <View style={styles.infoCard}>
                      <Text style={styles.infoText}>{addressText}</Text>
                  </View>

                  <TouchableOpacity style={[styles.actionButton, styles.btnGreen]}>
                      <Text style={styles.btnTextGreen}>Compartilhar</Text>
                  </TouchableOpacity>

                  <Text style={styles.sectionTitle}>Identificador do Localizador</Text>
                  <View style={styles.tagCard}>
                      <View style={{flexDirection:'row', alignItems:'center'}}>
                           <Image
                          source={require('../../../assets/icon/bluetooth-icon.png')} 
                          style={styles.tagIcon}
                          resizeMode="contain"
                        />
                          <Text style={styles.tagText}>{currentTagId}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                      style={[styles.actionButton, styles.btnGreen, {marginBottom: 20}]}
                      onPress={() => {
                          if (geofenceCenter) {
                              mapRef.current.animateToRegion({ ...geofenceCenter, latitudeDelta: 0.005, longitudeDelta: 0.005 });
                          }
                          setIsEditingGeofence(true);
                      }}
                  >
                      <Text style={styles.btnTextGreen}>Definir Área Segura</Text>
                  </TouchableOpacity>
              </>
            ) : (
              <View>
                    <Text style={[styles.SecAreaTxt, {textAlign:'center'}]}>Toque no mapa para definir o centro</Text>
                <View style={styles.sliderContainer}>
                    <Text style={[styles.SecAreaTxt, {textAlign:'center'}]}>Raio: {Math.round(geofenceRadius)}m</Text>
                    <Slider
                      style={{width: '100%', height: 30}}
                      minimumValue={10} maximumValue={500} step={10}
                      value={geofenceRadius} onValueChange={setGeofenceRadius}
                      minimumTrackTintColor="#2B6FD6" maximumTrackTintColor="#2B6FD6"
                      thumbTintColor='#FFF'
                    />
                    <TouchableOpacity style={[styles.actionButton, styles.btnBlue, {marginTop: 10}]} onPress={handleSaveGeofence}>
                        <Text style={styles.btnTextBlue}>{isSavingGeofence ? "Salvando..." : "Salvar Área"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => setIsEditingGeofence(false)}>
                        <Text style={{color: '#FF4540', fontWeight:'bold'}}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.sectionTitle}>Tag de localização</Text>
                <View style={styles.tagCard}>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                           <Image
                          source={require('../../../assets/icon/bluetooth-icon.png')} // <-- Coloque o nome do seu arquivo aqui
                          style={styles.tagIcon}
                          resizeMode="contain"
                        />
                          <Text style={styles.tagText}>{currentTagId}</Text>
                    </View>
                </View>
                <View style={styles.tagCard}>
                  <TextInput
                        placeholder="Informe ID da Tag"
                        value={tagIdInput}
                        onChangeText={setTagIdInput}
                        style={styles.inputSimple}
                        placeholderTextColor="#d7e8fcff"
                    />
                </View>
                    {tagIdInput.length > 0 && (
                      <TouchableOpacity style={[styles.actionButton, styles.btnBlue]} onPress={handleSaveTagId}>
                          <Text style={styles.btnTextBlue}>Salvar</Text>
                      </TouchableOpacity>
                  )}
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      );
    }
    
    // Tutor sem conexão
    return (
      <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Conectar ao Usuário</Text>
          <Text style={styles.info}>Insira o código de 6 dígitos:</Text>
          <TextInput
            placeholder="Código de Convite"
            value={inviteCodeInput}
            onChangeText={setInviteCodeInput}
            style={styles.input}
            autoCapitalize="characters"
            maxLength={6}
            editable={!isLinking}
          />
          <Button title={isLinking ? "Conectando..." : "Conectar"} onPress={handleLinkCode} disabled={isLinking} />
          <View style={styles.logoutButtonContainer}>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (userData.tipo === 'USUARIO_TEA') {
    if (userData.tutorConectado) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Usuário Conectado!</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Meu Código de Convite</Text>
        <Text style={styles.codeText}>{userData.codigoConvite || '...'}</Text>
      </View>
    );
  }
  
  return <View style={styles.container}><Text style={styles.text}>Carregando...</Text></View>;
}