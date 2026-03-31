import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

export const style = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 35,
    },
    boxTop: {
        height: height * 0.35,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    circuloFoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E6DFF3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(107, 13, 196, 0.1)',
    },
    imageFoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    iconPlus: {
        position: 'absolute',
        bottom: 5,
        right: 0,
        backgroundColor: '#6b0dc4',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    textTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',

    },
    textSubtitle: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    boxMid: {
        width: '100%',
    },
    boxInput: {
        width: '100%',
        height: 55,
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    Input: {
        flex: 1,
        height: '100%',
        marginLeft: 12,
        fontSize: 15,
        color: '#333',
    },
    boxBottom: {
        marginTop: 30,
        alignItems: "center",
    },
    Button: {
        width: width - 70,
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    TextButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    textInfo: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
    },
    footerContainer: {
        flexDirection: 'row',
        marginTop: 40,
        alignItems: 'center',
    },
    TextBottom: {
        fontSize: 15,
        color: '#444',
    },
    TextBottomCreate: {
        fontSize: 15,
        color: '#6b0dc4',
        fontWeight: 'bold',
    },

    recoveryButton: {
        alignSelf: 'flex-end', 
        marginTop: 10,
        paddingVertical: 5,
    },
    TextRecoveryColor: {
        color: '#6b0dc4',
        fontSize: 14,
        fontWeight: '500',
    },

    




});

export default style; 