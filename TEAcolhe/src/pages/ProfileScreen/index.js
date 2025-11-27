import React, { useState, useEffect } from 'react';
import {View,Text,TouchableOpacity,Alert,ActivityIndicator,Image,ScrollView } from 'react-native';
import styles from './style';

// Firebase Imports
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectedName, setConnectedName] = useState("Não conectado");

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);

            let idConectado = null;
            if (data.tipo === 'USUARIO_TEA') {
                idConectado = data.tutorConectado;
            } else if (data.tipo === 'TUTOR') {
                idConectado = data.usuarioConectado;
            }

            if (idConectado) {
                const connectedDocRef = doc(db, 'users', idConectado);
                const connectedSnap = await getDoc(connectedDocRef);
                if (connectedSnap.exists()) {
                    setConnectedName(connectedSnap.data().nome);
                } else {
                    setConnectedName("Usuário não encontrado");
                }
            }
          }
        } catch (error) {
          console.log('Erro ao carregar perfil:', error);
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
      Alert.alert('Erro', 'Não foi possível sair.');
    }
  };

  const isTutor = userData?.tipo === 'TUTOR';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Perfil</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2B6FD6" style={{ marginVertical: 40 }} />
      ) : (
        <>
          {/* CARD DO TOPO */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require('../../../assets/img/avatar-placeholder.png')}
                style={styles.avatar}
              />
            </View>

            <View style={styles.profileTextArea}>
              <Text style={styles.profileName}>
                {userData?.nome || 'Usuário'}
              </Text>
              <Text style={styles.profileSubtext}>
                {isTutor ? 'Responsável (Tutor)' : 'Usuário TEA'}
              </Text>
            </View>
          </View>

          {/* SEÇÃO: EMAIL (Usa infoIconCircle - com fundo branco) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações da conta</Text>

            <View style={styles.infoRowCard}>
              <View style={styles.infoIconCircle}>
                <Image
                  source={require('../../../assets/icon/mail-icon.png')}
                  style={[styles.activeIconContainer, styles.mailIcon]}
                />
              </View>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>
          </View>

          {/* SEÇÃO: ACOMPANHANDO (Usa transparentIconWrapper - sem fundo) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                {isTutor ? 'Monitorando:' : 'Conectado a:'}
            </Text>

            <View style={[styles.infoRowCard, styles.connectedCard]}>
              {/* MUDANÇA AQUI: Usando estilo transparente */}
              <View style={styles.transparentIconWrapper}>
                <Image
                  source={require('../../../assets/icon/logo-profile-icon.png')}
                  style={styles.logoProfileIcon}
                />
              </View>

              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoValue}>
                  {connectedName}
                </Text>
              </View>

              {connectedName !== "Não conectado" && (
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>Conectado</Text>
                  </View>
              )}
            </View>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}