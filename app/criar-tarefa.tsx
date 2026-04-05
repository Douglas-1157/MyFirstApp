import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { styles } from './editstyle';
import Groq from "groq-sdk";
import { format, parse } from 'date-fns';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

const CORES = [
  { id: '1', gradient: ["#5e5ce6", "#8b8bf5"] as const },
  { id: '2', gradient: ["#ff375f", "#ff6b8a"] as const },
  { id: '3', gradient: ["#34c759", "#70e7b9"] as const },
  { id: '4', gradient: ["#ff9500", "#ffcc00"] as const },
  { id: '5', gradient: ["#007aff", "#00c6ff"] as const },
  { id: '6', gradient: ["#323232", "#555555"] as const },
  { id: '7', gradient: ["#fd5cd5", "#c2336f"] as const },
];

const groq = new Groq({ apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY });

const InputField = ({ label, ...props }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor="#999" {...props} />
  </View>
);

const SubtaskItem = ({ item, onToggle, onRemove, color }: any) => (
  <View style={[styles.subtaskItem, { alignItems: 'flex-start', paddingVertical: 12 }]}>
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}
      onPress={onToggle}
    >
      <MaterialIcons
        name={item.completed ? "check-circle" : "radio-button-unchecked"}
        size={24}
        color={item.completed ? "#34c759" : color}
        style={{ marginTop: 2 }}
      />
      <Text style={[
        { marginLeft: 10, color: '#333', fontSize: 16, flex: 1, flexWrap: 'wrap' },
        item.completed && { color: '#AAA', textDecorationLine: 'line-through' }
      ]}>
        {item.text}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onRemove} style={{ paddingHorizontal: 8, paddingTop: 2 }}>
      <MaterialIcons name="delete-outline" size={22} color="#FF3B30" />
    </TouchableOpacity>
  </View>
);

export default function EditTarefa() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [iaLoading, setIaLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [selectedGradient, setSelectedGradient] = useState<readonly string[]>(CORES[0].gradient);
  const [subtasks, setSubtasks] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setMode(currentMode);
    setShowPicker(true);
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) return Alert.alert("IA", "Diga o que você quer criar.");
    setIaLoading(true);
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Você é o Motor de Execução do UPLY. 
            REGRAS OBRIGATÓRIAS:
            1. TITULO: não pode passsar de 15 caracteres.
            2. DESCRICAO: no máximo 60 caracteres.
            3. SUBTAREFAS: Crie entre 7 a 10 tarefas.
            FORMATO JSON: {"titulo": "...", "descricao": "...", "cor_index": 0-6, "subtarefas": ["..."]}`
          },
          { role: "user", content: `Plano curto para: ${aiPrompt}` },
        ],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" },
        temperature: 0.6,
      });

      const data = JSON.parse(chatCompletion.choices[0].message.content || "{}");
      setTitle((data.titulo || "Tarefa").substring(0, 15));
      setDescription((data.descricao || "").substring(0, 60));
      if (typeof data.cor_index === 'number' && CORES[data.cor_index]) {
        setSelectedGradient(CORES[data.cor_index].gradient);
      }
      if (data.subtarefas) {
        setSubtasks(data.subtarefas.map((t: string) => ({
          id: `${Date.now()}-${Math.random()}`,
          text: t.substring(0, 40),
          completed: false
        })));
      }
      setAiPrompt("");
    } catch (e) { Alert.alert("Erro", "A IA falhou."); } finally { setIaLoading(false); }
  };

  useEffect(() => {
    const loadTask = async () => {
      try {
        if (!id || id === 'novo') { setLoading(false); return; }
        const snap = await getDoc(doc(db, "tasks", id as string));
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title || "");
          setDescription(data.description || "");
          setSelectedGradient(data.gradient || CORES[0].gradient);
          setSubtasks(data.subtasks || []);
          if (data.date) {
            const parsedDate = parse(data.date, 'dd-MM-yyyy', new Date());
            if (data.time) {
              const [h, m] = data.time.split(':');
              parsedDate.setHours(parseInt(h), parseInt(m));
            }
            setDate(parsedDate);
          }
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
    if (!user) return Alert.alert("Erro", "Logue-se primeiro.");
    if (!title.trim()) return Alert.alert("Atenção", "Título obrigatório.");
    try {
      const isNew = !id || id === 'novo';
      const finalId = isNew ? `task_${Date.now()}_${user.uid}` : id;
      await setDoc(doc(db, "tasks", finalId as string), {
        userId: user.uid,
        title,
        description,
        gradient: selectedGradient,
        subtasks,
        progress,
        date: format(date, 'dd-MM-yyyy'),
        time: format(date, 'HH:mm'),
        updatedAt: new Date()
      }, { merge: true });
      router.replace("/(tabs)/home");
    } catch (e) { Alert.alert("Erro ao salvar"); }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={selectedGradient[0]} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{id === 'novo' ? "Crie sua tarefa" : "Editar Tarefa"}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={{ color: selectedGradient[0], fontWeight: 'bold', fontSize: 16 }}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View style={[styles.inputGroup, { marginTop: 10 }]}>
          <Text style={[styles.label, { color: selectedGradient[0] }]}>✨ Assistente de tarefas</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={[styles.input, { flex: 1, borderStyle: 'dashed', borderColor: selectedGradient[0] }]}
              placeholder="Ex: Fazer café..."
              value={aiPrompt}
              onChangeText={setAiPrompt}
            />
            <TouchableOpacity
              onPress={handleGenerateWithAI}
              disabled={iaLoading}
              style={{ backgroundColor: selectedGradient[0], padding: 15, borderRadius: 15, marginLeft: 10 }}
            >
              {iaLoading ? <ActivityIndicator color="#fff" size="small" /> : <MaterialIcons name="auto-awesome" size={24} color="#FFF" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD DE EXEMPLO DINÂMICO */}
        <LinearGradient
          colors={selectedGradient as any}
          style={[styles.cardStats, { borderRadius: 24, padding: 20, marginBottom: 20, height: 'auto', minHeight: 110 }]}
        >
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }} numberOfLines={1}>
            {title || "Título"}
          </Text>
          
          {description ? (
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 }} numberOfLines={2}>
              {description}
            </Text>
          ) : null}

          <View style={{ marginTop: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialIcons name="event" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginLeft: 4 }}>
                {format(date, 'dd/MM/yyyy')} às {format(date, 'HH:mm')}
              </Text>
            </View>
            <View style={[styles.progressBarBase, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
              <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: '#fff' }]} />
            </View>
          </View>
        </LinearGradient>

        <InputField label="Título" value={title} onChangeText={setTitle} maxLength={15} />
        <InputField label="Descrição" value={description} onChangeText={setDescription} multiline maxLength={60} />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data e Horário</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity 
              onPress={() => showMode('date')}
              style={[styles.input, { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
            >
              <Text style={{ color: '#333' }}>{format(date, 'dd/MM/yyyy')}</Text>
              <MaterialIcons name="calendar-today" size={20} color={selectedGradient[0]} />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => showMode('time')}
              style={[styles.input, { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
            >
              <Text style={{ color: '#333' }}>{format(date, 'HH:mm')}</Text>
              <MaterialIcons name="access-time" size={20} color={selectedGradient[0]} />
            </TouchableOpacity>
          </View>
        </View>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cores</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CORES.map(cor => {
              const isSelected = selectedGradient[0] === cor.gradient[0];
              return (
                <TouchableOpacity
                  key={cor.id}
                  onPress={() => setSelectedGradient(cor.gradient)}
                  activeOpacity={0.8}
                  style={{
                    width: 50, height: 50, borderRadius: 25,
                    justifyContent: 'center', alignItems: 'center', marginRight: 12,
                    borderWidth: isSelected ? 2 : 0, borderColor: '#333',
                  }}
                >
                  <LinearGradient colors={cor.gradient as any} style={{ width: 40, height: 40, borderRadius: 20 }} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tarefas</Text>
          <View style={{ flexDirection: 'row', marginBottom: 15 }}>
            <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="Crie sua tarefa" value={newSubtask} onChangeText={setNewSubtask} />
            <TouchableOpacity
              onPress={() => { if (!newSubtask.trim()) return; setSubtasks([...subtasks, { id: Date.now().toString(), text: newSubtask, completed: false }]); setNewSubtask(""); }}
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