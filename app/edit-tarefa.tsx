import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { styles } from './editstyle';

const CORES = [
  { id: '1', gradient: ["#5e5ce6", "#8b8bf5"] }, 
  { id: '2', gradient: ["#ff375f", "#ff6b8a"] }, 
  { id: '3', gradient: ["#34c759", "#32d74b"] }, 
  { id: '4', gradient: ["#ff9500", "#ffcc00"] }, 
  { id: '5', gradient: ["#007aff", "#00c6ff"] }, 
  { id: '6', gradient: ["#323232", "#555555"] }, 
];

// componentes
const InputField = ({ label, ...props }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor="#999" {...props} />
  </View>
);

const SubtaskItem = ({ item, onToggle, onRemove, color }: any) => (
  <View style={styles.subtaskItem}>
    <TouchableOpacity 
      style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} 
      onPress={onToggle}
    >
      <MaterialIcons 
        name={item.completed ? "check-circle" : "radio-button-unchecked"} 
        size={24} color={color} 
      />
      <Text style={[
        { marginLeft: 10, color: '#333' },
        item.completed && { color: '#AAA', textDecorationLine: 'line-through' }
      ]}>
        {item.text}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onRemove}>
      <MaterialIcons name="delete-outline" size={20} color="#FF3B30" />
    </TouchableOpacity>
  </View>
);

export default function EditTarefa() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newSubtask, setNewSubtask] = useState(""); 
  const [selectedGradient, setSelectedGradient] = useState(CORES[0].gradient);
  const [subtasks, setSubtasks] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadTask = async () => {
      try {
        if (!id || id === 'exemplo_1' || id === 'novo') {
          setTitle(id === 'novo' ? "" : "Nova Tarefa");
          setLoading(false);
          return;
        }
        const snap = await getDoc(doc(db, "tasks", id as string));
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title || "");
          setDescription(data.description || "");
          setSelectedGradient(data.gradient || CORES[0].gradient);
          setSubtasks(data.subtasks || []);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    loadTask();
  }, [id]);

  useEffect(() => {
    const completed = subtasks.filter(s => s.completed).length;
    setProgress(subtasks.length > 0 ? Math.round((completed / subtasks.length) * 100) : 0);
  }, [subtasks]);

  const handleSave = async () => {
    try {
      const isNew = !id || id === 'exemplo_1' || id === 'novo';
      const finalId = isNew ? `task_${Date.now()}` : id;
      await setDoc(doc(db, "tasks", finalId as string), {
        title, description, gradient: selectedGradient,
        subtasks, progress, updatedAt: new Date()
      }, { merge: true });
      router.back();
    } catch (e) { Alert.alert("Erro ao salvar"); }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#5e5ce6" />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={{ color: selectedGradient[0], fontWeight: 'bold', fontSize: 16 }}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* PREVIEW CARD */}
        <View style={[styles.cardStats, { backgroundColor: selectedGradient[0], borderRadius: 24, padding: 20 }]}>
           <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>{title || "Título"}</Text>
           <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 5 }} numberOfLines={2}>
              {description || "Sem descrição..."}
           </Text>
           <View style={[styles.progressBarBase, { backgroundColor: 'rgba(255,255,255,0.3)', marginTop: 15 }]}>
              <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: '#fff' }]} />
           </View>
           {/* PORCENTAGEM VOLTOU AQUI: */}
           <Text style={{ color: '#fff', fontSize: 12, marginTop: 5 }}>{progress}% concluído</Text>
        </View>

        {/* FORMULÁRIO COMPONENTIZADO */}
        <InputField label="Título" value={title} onChangeText={setTitle} maxLength={20} />
        
        <InputField 
          label="Descrição" 
          value={description} 
          onChangeText={setDescription}
          multiline
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        />

        {/* SELETOR DE CORES */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cor do Card</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CORES.map(cor => (
              <TouchableOpacity 
                key={cor.id} 
                onPress={() => setSelectedGradient(cor.gradient)}
                style={{ 
                  width: 44, height: 44, borderRadius: 22, backgroundColor: cor.gradient[0], 
                  marginRight: 12, borderWidth: 3,
                  borderColor: selectedGradient[0] === cor.gradient[0] ? '#333' : 'transparent'
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* SUBTAREFAS */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Subtarefas</Text>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <TextInput 
              style={[styles.input, { flex: 1, marginBottom: 0 }]} 
              placeholder="Adicionar..." 
              value={newSubtask} 
              onChangeText={setNewSubtask} 
            />
            <TouchableOpacity 
              onPress={() => {
                if (!newSubtask.trim()) return;
                setSubtasks([...subtasks, { id: Date.now().toString(), text: newSubtask, completed: false }]);
                setNewSubtask("");
              }} 
              style={{ backgroundColor: selectedGradient[0], padding: 15, borderRadius: 15, marginLeft: 10 }}
            >
              <MaterialIcons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {subtasks.map(item => (
            <SubtaskItem 
              key={item.id}
              item={item}
              color={selectedGradient[0]}
              onToggle={() => setSubtasks(subtasks.map(s => s.id === item.id ? { ...s, completed: !s.completed } : s))}
              onRemove={() => setSubtasks(subtasks.filter(s => s.id !== item.id))}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}