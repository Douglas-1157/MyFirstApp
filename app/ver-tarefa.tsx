import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { styles } from './verstyle'; 

const PRIMARY_COLOR = "#a382ec"; 
const TEXT_COLOR = "#2a1562"; 
const BG_COLOR = "#F4F0FD"; 

// Componente de Item da Subtarefa 
const SubtaskItem = ({ item, color, onToggle }: any) => (
  <TouchableOpacity 
    style={styles.subtaskItem} 
    activeOpacity={0.7} 
    onPress={onToggle}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <MaterialIcons 
        name={item.completed ? "check-circle" : "radio-button-unchecked"} 
        size={26} 
        color={item.completed ? "#34c759" : color} 
      />
      <Text style={[
        { marginLeft: 12, color: '#333', fontSize: 16, fontWeight: '500' },
        item.completed && { color: '#AAA', textDecorationLine: 'line-through' }
      ]}>
        {item.text}
      </Text>
    </View>
    {item.hora && <Text style={{ color: '#AAA', fontSize: 12 }}>{item.hora}</Text>}
  </TouchableOpacity>
);

export default function VerTarefa() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState<any>(null);

  // Estados calculados
  const [totalSubs, setTotalSubs] = useState(0);
  const [concluidasSubs, setConcluidasSubs] = useState(0);
  const [pendentesSubs, setPendentesSubs] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadTaskData = async () => {
      if (!user || !id) return;
      try {
        const snap = await getDoc(doc(db, "tasks", id as string));
        if (snap.exists()) {
          const data = snap.data();
          if (data.userId && data.userId !== user?.uid) {
            Alert.alert("Erro", "Acesso negado.");
            router.back();
            return;
          }
          setTaskData(data);
          atualizarEstadosLocais(data.subtasks || []);
        } else {
          router.back();
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    loadTaskData();
  }, [id, user]);

  // Função para calcular os números e progresso
  const atualizarEstadosLocais = (subtasks: any[]) => {
    const total = subtasks.length;
    const concluidas = subtasks.filter((s: any) => s.completed).length;
    const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    setTotalSubs(total);
    setConcluidasSubs(concluidas);
    setPendentesSubs(total - concluidas);
    setProgress(progresso);
  };

  // Função para Marcar/Desmarcar subtarefa 
  const toggleSubtask = async (subtaskId: string) => {
    if (!taskData || !id) return;

    const novasSubtasks = taskData.subtasks.map((s: any) => 
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );

    // Calcula novo progresso para salvar no banco
    const total = novasSubtasks.length;
    const concluidas = novasSubtasks.filter((s: any) => s.completed).length;
    const novoProgresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    try {
      // Atualiza no Firebase
      await updateDoc(doc(db, "tasks", id as string), {
        subtasks: novasSubtasks,
        progress: novoProgresso
      });

      // Atualiza a tela
      setTaskData({ ...taskData, subtasks: novasSubtasks });
      atualizarEstadosLocais(novasSubtasks);

    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar a alteração.");
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: BG_COLOR }} size="large" color={PRIMARY_COLOR} />;
  if (!taskData) return null;

  const cardColor = taskData.gradient ? taskData.gradient[0] : PRIMARY_COLOR;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: BG_COLOR }]}>
      
     
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color={TEXT_COLOR} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: TEXT_COLOR }]}>{taskData.title}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}>
        
        {/* PROGRESSO */}
        <View style={styles.cardProgresso}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: PRIMARY_COLOR }}>{progress}%</Text>
                <View style={{ flex: 1, height: 10, backgroundColor: 'rgba(163, 130, 236, 0.1)', borderRadius: 5, marginLeft: 15, overflow: 'hidden' }}>
                    <View style={{ width: `${progress}%`, height: '100%', backgroundColor: PRIMARY_COLOR, borderRadius: 5 }} />
                </View>
            </View>
        </View>

      
        <View style={styles.gridResumo}>
            <View style={styles.boxTotalTasks}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: TEXT_COLOR }}>{totalSubs}</Text>
                <Text style={{ fontSize: 14, color: 'rgba(42, 21, 98, 0.5)', fontWeight: '600' }}>TAREFAS</Text>
            </View>
            
            <View style={{ width: 1, backgroundColor: 'rgba(163, 130, 236, 0.2)', height: '60%' }} />

            <View style={styles.boxDetalhesTasks}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: TEXT_COLOR }}>
                    <Text style={{ color: '#34c759' }}>{concluidasSubs}</Text> concluídas
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: TEXT_COLOR, marginTop: 6 }}>
                    <Text style={{ color: '#F3819A' }}>{pendentesSubs}</Text> pendentes
                </Text>
            </View>
        </View>

        {/* LISTA DE SUBTAREFAS */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: TEXT_COLOR, fontSize: 18, fontWeight: 'bold', marginBottom: 15 }]}>Tarefas</Text>
          
          {taskData.subtasks && taskData.subtasks.map((item: any) => (
            <SubtaskItem 
              key={item.id}
              item={item}
              color={cardColor}
              onToggle={() => toggleSubtask(item.id)}
            />
          ))}
        </View>

      </ScrollView>

      {/* BOTÃO EDITAR */}
      <TouchableOpacity
          style={[styles.fab, { backgroundColor: PRIMARY_COLOR }]}
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/edit-tarefa", params: { id: id } })}
        >
          <MaterialIcons name="edit" size={28} color="#FFF" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}