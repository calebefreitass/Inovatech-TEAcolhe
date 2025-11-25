import React, { useEffect, useState } from 'react';
import styles from './style';
import { View, ScrollView, Keyboard, TextInput, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { createFontComponent } from 'expo-dynamic-fonts';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

const PoppinsText = createFontComponent('Poppins');
const NunitoText = createFontComponent('Nunito');

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha email e senha.');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Login realizado como', user.email);
            })
            .catch((error) => {
                Alert.alert('Erro', 'Email ou senha inválidos.');
                console.error(error);
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
                    <Image 
                        source={require('../../../assets/img/logo-text.png')}
                        style={styles.img_logo}
                    />
                </View>
                <View style={styles.section2}>
                    <PoppinsText style={styles.text}>Faça seu login</PoppinsText>

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
                            keyboardType='email-address' 
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Image 
                            source={require('../../../assets/icon/lock-icon.png')}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Senha'
                            placeholderTextColor={'#A5C9F8'}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry 
                        />
                    </View>
                        
                    <NunitoText style={[styles.text, {marginTop: 15}, {fontWeight: '400'}, {fontSize: 18}, {alignSelf: 'flex-end'}, {marginRight: 40}]}>Esqueceu a senha?</NunitoText>
                </View>
                <View style={styles.section3}>
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <PoppinsText style={styles.textButton}>Entrar</PoppinsText>
                    </TouchableOpacity>
                    <PoppinsText style={styles.textcontainer}>ou</PoppinsText>
                    <TouchableOpacity style={[styles.button,  {backgroundColor: '#FFF'}, {borderWidth: 1}, {borderColor: '#A5C9F8'}]}>
                        <PoppinsText style={styles.textButton}>Google</PoppinsText>
                    </TouchableOpacity>
                    <PoppinsText style={[styles.text, {marginTop: 10}, {fontSize: 12}, {fontWeight: 'bold'}, {textAlign: 'center'}, {marginLeft: 0}]}>Ao fazer login, você concorda com nossos {'\n'}Termos, Política de Privacidade.</PoppinsText>
                </View>
            </View>
            <View style={styles.footer}>
                <PoppinsText style={[styles.text, {fontSize: 15}, {textAlign: 'center'}, {marginLeft: 0}]}>Não tem conta? </PoppinsText>
                <PoppinsText 
                    style={[styles.text, {fontSize: 15}, {fontWeight: 'bold'}, {textAlign: 'center'}, {marginLeft: 0}]}
                    onPress={() => Navigation.navigate('RegisterScreen')}
                > 
                    Criar conta
                </PoppinsText>
            </View>
        </ImageBackground>
    );
}

export default LoginScreen;