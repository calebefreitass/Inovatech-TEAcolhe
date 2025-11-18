// src/pages/GenericScreen/index.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GenericScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela: {route.name}</Text>
      <Text style={styles.subtext}>Em desenvolvimento...</Text>
    </View>
  );
  

  
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#2B6FD6' },
  subtext: { fontSize: 16, color: '#555', marginTop: 10 }
});