import { themas } from "@/global/themes.";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet } from "react-native";
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";
const { width: screenWidth } = Dimensions.get('window');





export const style = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    

  },

  Text: {
    color:"#000000",
    fontSize: 30,
    //fontFamily: 'StoryScript_400Regular',
    marginTop: 10,
    
  },

  boxTop: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },

  boxInput: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderRadius: 60,
    marginTop: 135,
    marginRight: 50,
    alignItems: 'center',
    paddingHorizontal: 5,
    borderColor: '#6b0dc4',
    paddingLeft: 5,
  },


 Input: {
    width: '100%',
    height: '100%',
    paddingLeft: 15,
    paddingRight: 30,
    fontSize: 16,
    borderRadius: 60,
    
 },

  Usuario: {
    color:"#000000",
    fontSize: 30,
    //fontFamily: 'StoryScript_400Regular',

  },


  userFoto: {
  width: 55,
  height: 55,
  borderRadius: 100, 
  borderWidth: 2,
  borderColor: '#6A1B9A', 
},

  textUser: {
    flexDirection: 'row',
    
    
  }

  
  


})


export default style;