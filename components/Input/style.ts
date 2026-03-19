import { StyleSheet } from "react-native";
import { themas } from "@/global/themes.";
export const style = StyleSheet.create({

    boxInput: {
        width: 300,
        height: 70,
        borderWidth: 1,
        borderRadius: 60,
        marginTop: -10,
        flexDirection: 'row', //coloca o icone na linha, ao inves de na parte de baixo
        alignItems: 'center',
        paddingHorizontal: 5,
        //backgroundColor:themas.colors.lightGray,
        borderColor: '#6b0dc4'
    },

    Input: {
        height: '100%',
        width: '90%',
        borderRadius: 40,
        paddingLeft: 5
        //backgroundColor: 'gray'

    },

    titleInput: {
        marginLeft: 5,
        color: themas.colors.gray,
        marginTop: 20
    },

    Icon: {

    },






    

})