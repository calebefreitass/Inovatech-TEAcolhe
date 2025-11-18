import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from './style'; // Importa o estilo local

// Imports do Firebase para o Logout
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig'; 

export default function ProfileScreen() {
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // O 'ouvinte' em src/routes/index.js vai detectar isso
      // e automaticamente trocar para a tela de login (AuthStack).
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil & Configurações</Text>
      
      {/* (Outras opções de perfil, como "Trocar Senha", podem vir aqui) */}

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}