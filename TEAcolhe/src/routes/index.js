import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig'; // Importe o db
import { doc, onSnapshot } from 'firebase/firestore'; // Importe funções do Firestore
import { MaterialIcons } from '@expo/vector-icons'; 

// Import das Telas
import InitialScreen from '../pages/InitialScreen';
import LoginScreen from '../pages/LoginScreen';
import RegisterScreen from '../pages/RegisterScreen';
import LocationScreen from '../pages/LocationScreen'; 
import HomeScreen from '../pages/HomeScreen'; 
import AgendaScreen from '../pages/AgendaScreen'; 
import ProfileScreen from '../pages/ProfileScreen'; 
import ConnectionScreen from '../pages/ConnectionScreen'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); 

function AuthStack() {
    return (
        <Stack.Navigator initialRouteName='InitialScreen'>
            <Stack.Screen name='InitialScreen' component={InitialScreen} options={{ headerShown: false }} />
            <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: true, headerTitle: '', headerTransparent: true, headerTintColor: '#2B6FD6' }} />
            <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{ headerShown: true, headerTitle: '', headerTransparent: true, headerTintColor: '#2B6FD6' }} />
        </Stack.Navigator>
    )
}

function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true, 
                tabBarActiveTintColor: '#2B6FD6', 
                tabBarInactiveTintColor: '#A5C9F8', 
                tabBarStyle: {
                    height: 80,
                    paddingBottom: 15,
                    paddingTop: 10,
                    backgroundColor: '#FFF',
                    borderTopWidth: 2,
                    borderTopColor: '#A5C9F8', 
                    elevation: 0, 
                },
                tabBarLabelStyle: { fontSize: 12, marginTop: 5 },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let iconSource;
                    let isImage = false;

                    if (route.name === 'Início'){
                        iconSource = require('../../assets/icon/home-icon.png');
                         isImage = true; 
                    } 
                    else if (route.name === 'Localização'){
                        iconSource = require('../../assets/icon/location-icon.png');
                         isImage = true;
                    } 
                    else if (route.name === 'Agenda'){
                        iconSource = require('../../assets/icon/calendar-icon.png');
                         isImage = true;
                    } 
                    else if (route.name === 'Perfil') {
                         iconSource = require('../../assets/icon/profile-icon.png');
                         isImage = true;
                    }

                    if (focused) {
                        return (
                            <View style={styles.activeIconContainer}>
                                {isImage ? (
                                    <Image source={iconSource} style={{ width: 24, height: 24, tintColor: '#FFF' }} resizeMode="contain" />
                                ) : (
                                    <MaterialIcons name={iconName} size={24} color="#FFF" />
                                )}
                            </View>
                        );
                    }
                    return isImage ? (
                        <Image source={iconSource} style={{ width: 28, height: 28, tintColor: '#A5C9F8' }} resizeMode="contain" />
                    ) : (
                        <MaterialIcons name={iconName} size={28} color="#A5C9F8" />
                    );
                },
            })}
        >
            <Tab.Screen name="Início" component={HomeScreen} />
            <Tab.Screen name="Localização" component={LocationScreen} />
            <Tab.Screen name="Agenda" component={AgendaScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function Routes() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null); // Estado para guardar dados do Firestore
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            if (currentUser) {
                // Se logou, busca os dados no Firestore em tempo real
                const docRef = doc(db, 'users', currentUser.uid);
                const unsubscribeFirestore = onSnapshot(docRef, (doc) => {
                    setUserData(doc.data());
                    setLoadingData(false);
                });
                // Nota: Idealmente, deveríamos limpar esse listener do Firestore também
            } else {
                setUserData(null);
                setLoadingData(false);
            }
            if (initializing) setInitializing(false);
        });
        return unsubscribeAuth;
    }, []);

    if (initializing || (user && loadingData)) {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="large" color="#2B6FD6"/>
            </View>
        );
    }

    // LÓGICA DE NAVEGAÇÃO:

    // 1. Se não estiver logado -> AuthStack
    if (!user) {
        return <AuthStack />;
    }

    // 2. Se for USUÁRIO_TEA e NÃO tiver tutor conectado -> ConnectionScreen (Sem NavBar)
    if (userData?.tipo === 'USUARIO_TEA' && !userData?.tutorConectado) {
        return <ConnectionScreen />;
    }

    // 3. Caso contrário (Tutor ou Usuário já conectado) -> AppTabs (NavBar)
    return <AppTabs />;
}

const styles = StyleSheet.create({
    activeIconContainer: {
        width: 45,
        height: 45,
        backgroundColor: '#A5C9F8', 
        borderRadius: 25, 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5, 
    }
});