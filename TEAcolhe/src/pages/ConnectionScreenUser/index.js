import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard'; // Para copiar o código
import styles from './style';
import { MaterialIcons } from '@expo/vector-icons';

import { signOut } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function ConnectionScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userUID = auth.currentUser?.uid;

  useEffect(() => {
    if (!userUID) return;
    const docRef = doc(db, 'users', userUID);
    // Ouve o usuário em tempo real. 
    // Se 'tutorConectado' mudar, o Routes.js vai saber e trocar a tela automaticamente.
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        
        // Se não tiver código, gera um automaticamente
        if (!data.codigoConvite && !data.tutorConectado) {
          generateNewCode();
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userUID]);

  const generateNewCode = async () => {
    const novoCodigo = Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      await updateDoc(doc(db, 'users', userUID), {
        codigoConvite: novoCodigo
      });
    } catch (error) {
      console.error("Erro ao gerar código", error);
    }
  };

  const copyToClipboard = async () => {
    if (userData?.codigoConvite) {
      await Clipboard.setStringAsync(userData.codigoConvite);
      Alert.alert("Sucesso", "Código copiado para a área de transferência!");
    }
  };

  const handleLogout = async () => {
    try { await signOut(auth); } catch (error) {}
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#2B6FD6" /></View>;
  }

  return (
    <View style={styles.container}>
      {/* Header (Seta de voltar meramente visual, já que é a tela inicial) */}

      <Text style={styles.title}>Conexão Rápida</Text>

      <Text style={styles.description}>
        Conecte seus dispositivos instantaneamente com um código único.
      </Text>

      <View style={styles.mainCard}>

        <Text style={styles.subtitle}>Compartilhe este código</Text>

        <View style={styles.codeBoxContainer}>
            <Text style={styles.instructionText}>Use esse código único para conectar:</Text>
            <View style={styles.codeDisplay}>
                <Text style={styles.codeText}>
                    {userData?.codigoConvite || 'GERANDO...'}
                </Text>
            </View>
        </View>

        <TouchableOpacity style={[styles.actionButton, styles.btnCopy]} onPress={copyToClipboard}>
            <Text style={[styles.btnTextBlue, {color: '#FFF'}]}>Copiar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.btnGenerate]} onPress={generateNewCode}>
            <Text style={styles.btnTextBlue}>Gerar novo código</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

    </View>
  );
}