// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  initializeAuth, 
  getReactNativePersistence,
  onAuthStateChanged
} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCnk3d7cGQ1yuI9wl44b98J0UnDl_J-GBg",
  authDomain: "teacolhe-6cc0e.firebaseapp.com",
  projectId: "teacolhe-6cc0e",
  storageBucket: "teacolhe-6cc0e.firebasestorage.app",
  messagingSenderId: "1074364565078",
  appId: "1:1074364565078:web:e4c33fa36a75522f9eddf7"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Auth com persistência (AsyncStorage)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Inicializa o Firestore
const db = getFirestore(app);

// 5. Exporta os serviços E a função que o App.js precisa
export { auth, db, onAuthStateChanged }; 