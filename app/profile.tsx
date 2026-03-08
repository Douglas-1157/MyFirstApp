import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function Profile() {
  return (
      <ThemedView style={styles.container}>
            <ThemedText type="title">Tela de usuario!</ThemedText>
            <ThemedText>Esta é a sua tela de usuario.</ThemedText>
          </ThemedView>
    
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