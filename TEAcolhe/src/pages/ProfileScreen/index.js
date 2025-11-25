import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styles from './style'; 

// Imports do Firebase
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig'; 

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Pega o usuário atual da sessão de autenticação
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          // Busca o documento do usuário no Firestore para pegar o 'nome'
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.log("Erro ao carregar perfil:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2B6FD6" style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.infoCard}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{userData?.nome || "Não informado"}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email}</Text>

            <Text style={styles.label}>Tipo de Conta:</Text>
            <Text style={styles.value}>
                {userData?.tipo === 'TUTOR' ? 'Tutor (Responsável)' : 'Usuário TEA'}
            </Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}