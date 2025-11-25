import { View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import styles from './style';
import { useNavigation } from '@react-navigation/native';
import { createFontComponent } from 'expo-dynamic-fonts';

const PoppinsText = createFontComponent('Poppins');

export default function InitialScreenBackground() {
    const Navigation = useNavigation();

    return (
        <ImageBackground 
            source={require('../../../assets/img/background.png')}
            style={styles.container}
        >
            <View style={styles.header}></View>
            <View style={styles.main}>
                <View style={styles.section1}>
                    <Image 
                        style={styles.img_logo}
                        source={require('../../../assets/img/logo.png')}
                    />
                </View>
                <View style={styles.section2}>
                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: '#A5C9F8'}]}
                        onPress={() => Navigation.navigate('LoginScreen')}
                    >
                        <PoppinsText style={styles.textButton}>Entrar</PoppinsText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => Navigation.navigate('RegisterScreen')}
                    >
                        <PoppinsText style={styles.textButton}>Cadastrar</PoppinsText>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footer}></View>
        </ImageBackground>
    );
}