import { StyleSheet, View, Text} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Animated from 'react-native-reanimated/lib/typescript/Animated';
import {style} from "../style"
import { StoryScript_400Regular, useFonts } from '@expo-google-fonts/story-script';

export default function Home() {
  return (
    <View style={style.boxTop}>
      <Text style={style.Texto}>Como está o seu dia?</Text>

    </View>
  );






















}











const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});