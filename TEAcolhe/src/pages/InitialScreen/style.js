import { StyleSheet, Dimensions } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 2,
        //backgroundColor: 'white',
    },
    header: {
        flex: 0.5,
        //backgroundColor: 'tomato'
    },
    main: {
        flex: 4,
        display: 'flex'
    },
    img_logo: {
        width: wp(60),
        height: hp(60),
        resizeMode: 'contain',
    },
    section1: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'orange',
    },
    section2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'hotpink',
    },
    button: {
        backgroundColor: '#CAFFC6',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        width: '85%',
        height: hp(5),
        marginBottom: hp(1),
        marginTop: hp(1),
    },
    textButton: {
        color: '#2B6FD6',
        fontSize: wp(5),
        fontWeight: '500',
    },
    footer: {
        flex: 0.5,
        //backgroundColor: 'lightgreen',
    }
});

export default styles;