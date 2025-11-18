import React, { useState } from 'react';
import styles from './style';
import { View, TextInput, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { createFontComponent } from 'expo-dynamic-fonts';
import { auth, db } from '../../../firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const PoppinsText = createFontComponent('Poppins');

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('USUARIO_TEA');

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                return setDoc(doc(db, 'users', user.uid), {
                    nome: name,
                    email: user.email,
                    tipo: userType,
                    createdAt: serverTimestamp(),
                });
            })
            .then(() => {
                console.log('Registrado como', email);
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    Alert.alert('Erro', 'Este email já está em uso.');
                } else {
                    Alert.alert('Erro', 'Ocorreu um erro ao registrar.');
                    console.error(error);
                }
            });
    };
    
    return (
        <ImageBackground 
            source={require('../../../assets/img/background.png')}
            style={styles.container}
        >
            <View style={styles.header}></View>
            <View style={styles.main}>
                <View style={styles.section1}>
                    <PoppinsText style={styles.text}>Faça {'\n'}seu cadastro</PoppinsText>
                </View>
                <View style={styles.section2}>
                    <View style={styles.selectorContainer}>
                        <SegmentedButtons style={styles.selector}
                        value={userType}
                        onValueChange={setUserType}
                        buttons={[
                            { value: 'USUARIO_TEA', label: 'Autista' },
                            { value: 'TUTOR', label: 'Responsável' },
                        ]}
                        theme={styles.SegmentedTheme}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Image 
                            source={require('../../../assets/icon/user-icon.png')}
                         />
                        <TextInput 
                            style={styles.input}
                            placeholder='Nome'
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor={'#A5C9F8'} />
                    </View>

                    <View style={styles.inputContainer}>
                        <Image 
                            source={require('../../../assets/icon/mail-icon.png')}
                         />
                        <TextInput 
                            style={styles.input}
                            placeholder='Email'
                            placeholderTextColor={'#A5C9F8'}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize='none'
                            keyboardType='email-address' />
                    </View>

                    <View style={styles.inputContainer}>
                        <Image 
                            source={require('../../../assets/icon/lock-icon.png')} />
                        <TextInput
                            style={styles.input}
                            placeholder='Senha'
                            placeholderTextColor={'#A5C9F8'}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry />
                    </View>

                    <View style={styles.inputContainer}>
                        <Image 
                            source={require('../../../assets/icon/lock-icon.png')} />
                        <TextInput
                            style={styles.input}
                            placeholder='Confirmar senha'
                            placeholderTextColor={'#A5C9F8'}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry />
                    </View>
                </View>
                <View style={styles.section3}>
                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        <PoppinsText style={styles.textButton}>Cadastrar</PoppinsText>
                    </TouchableOpacity>
                    <PoppinsText style={styles.textcontainer}>ou</PoppinsText>
                    <TouchableOpacity style={[styles.button,  {backgroundColor: '#FFF'}, {borderWidth: 1}, {borderColor: '#A5C9F8'}]}>
                        <PoppinsText style={styles.textButton}>Google</PoppinsText>
                    </TouchableOpacity>
    
                    <PoppinsText style={[styles.text, {marginTop: 10}, {fontSize: 12}, {fontWeight: 'bold'}, {textAlign: 'center'}, {marginLeft: 0}]}>Seu cadastro implica a concordância com nossos {'\n'}Termos, Política de Privacidade.</PoppinsText>
                </View>
            </View>
            <View style={styles.footer}></View>
        </ImageBackground>
    );
}

export default RegisterScreen;