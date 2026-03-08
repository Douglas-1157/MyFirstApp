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

  Texto: {
    color:"#000000",
    paddingRight: '80%',
    fontSize: 30,
    fontFamily: 'StoryScript_400Regular',
  },

  boxTop: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }


})


export default style;