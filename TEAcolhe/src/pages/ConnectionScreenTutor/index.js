import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from './style';

import { signOut } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { collection, query, where, getDocs, doc, writeBatch } from 'firebase/firestore';

export default function ConnectionScreen() {
  const userUID = auth.currentUser?.uid;

  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userUID) return;
    setLoading(false); 
  }, [userUID]);

  // --- MOVIMENTADO PARA CÁ (Escopo do Componente) ---
  const handleLogout = async () => {
    try { 
      await signOut(auth); 
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  };
  // --------------------------------------------------
  
  const handleLinkCode = async () => {
    if (inviteCodeInput.length < 6) {
      Alert.alert("Código Inválido", "O código deve ter 6 caracteres.");
      return;
    }
    
    // A definição errada estava aqui. Removida.
    
    setIsLinking(true);
    
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef, 
        where("codigoConvite", "==", inviteCodeInput.toUpperCase()),
        where("tipo", "==", "USUARIO_TEA")
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        Alert.alert("Erro", "Nenhum usuário encontrado com este código.");
        setIsLinking(false);
        return;
      }
      
      const userToLinkDoc = querySnapshot.docs[0];
      const userToLinkUID = userToLinkDoc.id;
      
      const batch = writeBatch(db);
      
      const tutorRef = doc(db, 'users', userUID);
      batch.update(tutorRef, { 
        usuarioConectado: userToLinkUID 
      });
      
      const teaUserRef = doc(db, 'users', userToLinkUID);
      batch.update(teaUserRef, { 
        tutorConectado: userUID, 
        codigoConvite: null 
      });
      
      await batch.commit();
      Alert.alert("Sucesso!", "Conexão realizada com sucesso.");
      
    } catch (error) {
      console.error("Erro ao conectar:", error);
      Alert.alert("Erro", "Falha ao conectar. Verifique sua internet.");
    } finally {
      setIsLinking(false);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2B6FD6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          
          <Text style={styles.title}>Conectar ao Usuário</Text>

          <Text style={styles.description}>
            Insira o código de 6 dígitos gerado no aplicativo do usuário para iniciar o monitoramento.
          </Text>

          <View style={styles.mainCard}>
            <Text style={styles.subtitle}>Digite o código aqui</Text>

            <View style={styles.codeBoxContainer}>
              <Text style={styles.instructionText}>Código de convite:</Text>
              <View style={styles.codeDisplay}>
                <TextInput
                  style={styles.input}
                  placeholder="CÓDIGO"
                  placeholderTextColor="#A5C9F8"
                  value={inviteCodeInput}
                  onChangeText={setInviteCodeInput}
                  autoCapitalize="characters"
                  maxLength={6}
                  editable={!isLinking}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.actionButton, styles.btnCopy]}
              onPress={handleLinkCode}
              disabled={isLinking}
            >
              {isLinking ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={[styles.btnTextBlue, {color: '#FFF'}]}>Conectar</Text>
              )}
            </TouchableOpacity>

          </View>

          {/* Agora este botão consegue enxergar a função handleLogout */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}