import { StyleSheet, Dimensions } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'white',
    },
    header: {
        flex: 0.5,
        //backgroundColor: 'tomato'
    },
    main: {
        flex: 4,
        display: 'flex',
    },
    img_logo: {
        width: wp(75),
        height: hp(75),
        resizeMode: 'contain',
    },
    section1: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'left',
        paddingLeft: wp(6),
        //backgroundColor: 'orange',
    },
    section2: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#FFF',
    },
    section3: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    text: {
        color: '#2B6FD6',
        fontSize: wp(5),
        fontWeight: '500',
        marginLeft: wp(6),
        marginTop: hp(4),
        marginBottom: hp(1),
    },
    textcontainer: {
        color: '#A5C9F8',
        fontSize: wp(5),
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderColor: '#A5C9F8',
        borderWidth: 1,
        borderRadius: 10,
        width: '85%',
        height: hp(6),
        marginTop: wp(5),
        paddingLeft: 15,
        marginHorizontal: 20,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: wp(4),
    },
    button: {
        backgroundColor: '#A5C9F8',
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: hp(3),
        backgroundColor: '#FFF',
    }
});

export default styles;