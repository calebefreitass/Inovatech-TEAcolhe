import { StyleSheet, Dimensions } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
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
    section1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        //backgroundColor: 'orange',
    },
    section2: {
        flex: 3,
        justifyContent: 'center', // default: flex-start
        alignItems: 'center', // default: flex-start
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#FFF',
    },
    section3: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    text: {
        color: '#2B6FD6',
        fontSize: wp(7),
        marginTop: hp(2),
        marginBottom: hp(3),
        fontWeight: '500',
        textAlign: 'center',
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
    selectorContainer: {
        width: '85%',
    },
    SegmentedTheme: {
        colors: {
            secondaryContainer: '#CAFFC6',
            onSecondaryContainer: '#2B6FD6',
            surface: '#A5C9F8', 
            onSurface: '#2B6FD6',
            outline: 'transparent',
        },
        fontFamily: 'Poppins',
    },
    selector: {
        borderRadius: 20,
        backgroundColor: '#A5C9F8',
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
        flex: 0.1,
        backgroundColor: '#FFF',
    }
});

export default styles;