import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../../../firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import * as Location from 'expo-location';
import styles from './style';

export default function HomeScreen() {
  const [sending, setSending] = useState(false);
  const userUID = auth.currentUser?.uid;
  const [userName, setUserName] = useState("Usuário");

  // Carregar Nome do Usuário
  useEffect(() => {
    if(userUID) {
        getDoc(doc(db, 'users', userUID)).then(snap => {
            if(snap.exists()) setUserName(snap.data().nome || "Usuário");
        });
    }
  }, [userUID]);

  // Lógica do Botão de Pânico (SOS)
  const handlePanic = async () => {
    setSending(true);
    try {
      // 1. Localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      let locationData = null;
      
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        locationData = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
        };
      }

      // 2. Enviar Alerta
      await addDoc(collection(db, 'alerts'), {
        userId: userUID,
        type: 'PANIC',
        message: '🚨 PEDIDO DE SOCORRO! O usuário pressionou o botão de pânico.',
        timestamp: serverTimestamp(),
        read: false,
        location: locationData
      });

      Alert.alert("Alerta Enviado!", "Seu tutor foi notificado.");
    } catch (error) {
      Alert.alert("Erro", "Falha ao enviar alerta.");
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Cabeçalho Simples */}
      <View style={styles.headerContainer}>
          <Text style={styles.greetingText}>Olá, {userName}!</Text>
      </View>

      {/* O CARD PRINCIPAL (Baseado na imagem enviada) */}
      <View style={styles.card}>
          
          <Text style={styles.cardTitle}>Você precisa de ajuda?</Text>

          {/* Área da Imagem (Ilustração) */}
          <View style={styles.imageContainer}>
              {/* Substitua pelo require da sua imagem correta */}
              {/* Ex: source={require('../../../assets/img/help-illustration.png')} */}
              <Image 
                source={require('../../../assets/img/help-background.png')} 
                style={styles.illustration} 
                resizeMode="contain"
              />
          </View>

          {/* Botão de Socorro Vermelho */}
          <TouchableOpacity 
            style={styles.panicButton} 
            onPress={handlePanic}
            disabled={sending}
          >
            {sending ? (
                <ActivityIndicator size="small" color="#FFF" />
            ) : (
                <Text style={styles.panicButtonText}>Pedir ajuda</Text>
            )}
          </TouchableOpacity>

      </View>
    </View>
  );
}