import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

interface TaskCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    gradient: string[];
    progress: number;
  };
  fontLoaded: boolean;
  onDelete?: (id: string) => void;
  onPress?: () => void; // Nova prop para a navegação de edição
}

export const TaskCard = ({ item, fontLoaded, onDelete, onPress }: TaskCardProps) => {

  return (
    <View style={styles.card}>
      <LinearGradient colors={item.gradient as any} style={styles.cardGradient} />
      
      {/* Área de toque principal para EDITAR */}
      <TouchableOpacity 
        activeOpacity={0.8} 
        style={styles.mainContent}
        onPress={onPress} // Usa a função que vem da Home
      >
        <View style={styles.cardTop}>
          <Text style={[styles.cardTitle, fontLoaded && { fontFamily: "Coolvetica" }]}>
            {item.title}
          </Text>

          {/* Botão de EXCLUIR com stopPropagation */}
          <TouchableOpacity 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={(e) => {
              e.stopPropagation(); // Impede que o clique chegue no onPress do card
              onDelete?.(item.id);
            }}
            style={styles.deleteButton}
          >
            <MaterialIcons name="delete-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardSubtitle} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBase}>
            <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            <Text style={{ fontWeight: '900', color: '#1A1A1A' }}>{item.progress}%</Text> concluído
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 220,
    borderRadius: 32,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: '#FFF' // Fallback
  },
  cardGradient: { ...StyleSheet.absoluteFillObject },
  mainContent: { flex: 1, padding: 24, justifyContent: 'space-between' },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
  cardTitle: { fontSize: 28, fontWeight: "700", color: "#fff", flex: 1 },
  deleteButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 12,
  },
  cardSubtitle: { fontSize: 16, color: "#fff", opacity: 0.9, marginTop: -10 },
  progressContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 15 },
  progressBarBase: { height: 8, backgroundColor: '#EEE', borderRadius: 4, marginBottom: 8 },
  progressBarFill: { height: '100%', backgroundColor: '#8A2BE2', borderRadius: 4 },
  progressText: { fontSize: 14, color: '#666' }
});