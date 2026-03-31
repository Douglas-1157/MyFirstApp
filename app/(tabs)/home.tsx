import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { style } from "../style"; 
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import Calendario from "../../src/components/Calendario";
import ListaTarefas from "../../src/components/ListaTarefas";
import { BlurCarousel } from "../../src/components/molecules/blur-carousel";
import { TaskCard } from "../../src/components/molecules/TaskCard";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("...");
  const [userPhoto, setUserPhoto] = useState(null);
  const [dataFiltro, setDataFiltro] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  // atualiza o Firebase 
  useEffect(() => {
    const q = collection(db, "tasks"); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any;
        setTasks(tasksData);
      } else {
        setTasks([]); 
      }
    }, (error) => {
      console.log("Erro ao carregar:", error);
    });

    return () => unsubscribe();
  }, []);

  // Busca o usuario
  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, "usuarios", user.uid);
          const snapshot = await getDoc(userDoc);
          if (snapshot.exists()) {
            const dados = snapshot.data();
            setUserName(dados.nome);
            setUserPhoto(dados.foto);
          }
        }
      } catch (error) {}
    };
    getUserData();
  }, []);

  //apaga os card d tarefa
  const handleDeleteTask = (id: string) => {
    Alert.alert("Excluir", "Deseja apagar essa tarefa?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Excluir", 
        style: "destructive", 
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "tasks", id));
          } catch (e) { Alert.alert("Erro ao excluir"); }
        } 
      }
    ]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[style.Container, { backgroundColor: '#F9FAFC' }]}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={style.boxTop}>
            <View style={style.textUser}>
              <Text style={style.Text}>Olá,</Text>
              <Text style={style.Usuario}>{userName}</Text>
            </View>
            {userPhoto && <Image source={{ uri: userPhoto }} style={style.userFoto} />}
          </View>

          <View style={{ paddingHorizontal: 20, marginTop: -10 }}>
            <Calendario aoSelecionarData={(data: Date) => setDataFiltro(data)} />
          </View>

          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#212121', marginBottom: -15}}>Tarefas</Text>
          </View>

          {/* Carrossel*/}
          <View style={{ marginVertical: 0 }}>
            {tasks.length > 0 ? (
              <BlurCarousel
                data={tasks}
                renderItem={({ item }: any) => (
                  <TaskCard 
                    item={item} 
                    fontLoaded={true} 
                    onDelete={() => handleDeleteTask(item.id)}
                    onPress={() => router.push({ pathname: "/edit-tarefa", params: { id: item.id } })}
                  />
                )}
              />
            ) : (
              /* card d exemplo pra quando n tiver nenhum */
              <TouchableOpacity 
                style={style.cardVazio}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: "/edit-tarefa", params: { id: 'novo' } })}
              >
                <View style={{ backgroundColor: '#f0f0ff', padding: 20, borderRadius: 50 }}>
                   <MaterialIcons name="add" size={40} color="#5e5ce6" />
                </View>
                <Text style={style.cardVazioText}>Criar sua primeira tarefa</Text>
                <Text style={style.cardVazioSub}>Organize seu dia agora mesmo</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ paddingHorizontal: 20, paddingBottom: 40, marginTop: -25 }}>
            <ListaTarefas dataFiltro={dataFiltro} />
          </View>

        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}