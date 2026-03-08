import { themas } from "@/global/themes.";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet } from "react-native";
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";
const { width: screenWidth } = Dimensions.get('window');





export const style = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'


  },
  boxTop: {
    height: Dimensions.get('window').height / 3, //define uma melhor responsividade para a tela do usuario
    width: '100%',
    //backgroundColor:'red',
    alignItems: "center",
    justifyContent: "center"
  },
  boxMid: {
    height: Dimensions.get('window').height / 4, //define uma melhor responsividade para a tela do usuario
    width: '100%',
    //backgroundColor:'green',
    paddingHorizontal: 37

  },
  boxBottom: {
    height: Dimensions.get('window').height / 3, //define uma melhor responsividade para a tela do usuario
    width: '100%',
    //backgroundColor:'blue',
    alignItems: "center",
    padding: 15,
    flex: 1


  },
  image: {
    marginTop: 50,
    width: 150,
    height: 150,
    resizeMode: 'cover', //garente que a imagem não estique
    transform: [{ scale: 1.35 }],


  },
  text: {
    fontFamily: 'StoryScript_400Regular',
    fontSize: 40,
    //fontWeight: 'bold',
    marginTop: 0,
    color: '#6b0dc4',



  },

  titleInput: {
    marginLeft: 5,
    color: themas.colors.gray,
    marginTop: 20
  },
  boxInput: {
    width: 300,
    height: 70,
    borderWidth: 1,
    borderRadius: 60,
    marginTop: 30,
    flexDirection: 'row', //coloca o icone na linha, ao inves de na parte de baixo
    alignItems: 'center',
    paddingHorizontal: 5,
    //backgroundColor:themas.colors.lightGray,
    borderColor: '#6b0dc4',
    paddingLeft: 5
  },

  Input: {
    height: '100%',
    width: '90%',
    borderRadius: 40,
    paddingLeft: 5
    //backgroundColor: 'gray'

  },

  Button: {
    width: 300,
    height: 70,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderColor: '#000000',
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,

  },

  ButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },

  TextButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  TextBottom: {
    padding: 50,
    fontSize: 16,
    marginTop: 85,
    alignItems: 'center',
    flexDirection: 'row'
  
  },

  TextBottomCreate: {
    fontSize: 16,
    color: '#6b0dc4',
    fontWeight: 'bold',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 50,
    marginTop: 850,

  },

  TextRecovery: {
    padding: 10,
    fontSize: 16,

  },

  TextRecoveryColor: {
    color: '#6b0dc4',
    fontWeight: 'bold'
  },

  
  

 
})

export default style;