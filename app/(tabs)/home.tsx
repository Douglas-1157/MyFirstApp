import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { style } from "../style";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, collection, onSnapshot, deleteDoc, query, where, setDoc } from 'firebase/firestore'; 
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';

// Componentes
import Calendario from "../../src/components/Calendario";
import { BlurCarousel } from "../../src/components/molecules/blur-carousel";
import { TaskCard } from "../../src/components/molecules/TaskCard";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("...");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [dataFiltro, setDataFiltro] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});

  // 1. Monitora as tarefas do dia selecionado
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const dataFormatada = format(dataFiltro, 'dd-MM-yyyy');
      const q = query(
        collection(db, "tasks"), 
        where("userId", "==", user.uid),
        where("date", "==", dataFormatada)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksData);
      }, (error) => console.log("Erro ao carregar tarefas do dia:", error));
      
      return () => unsubscribe();
    }
  }, [dataFiltro]);

  // 2. MONITORAMENTO GLOBAL (Bolinhas do calendário)
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const marks: any = {};
        
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.date) {
            const [day, month, year] = data.date.split('-');
            const dateISO = `${year}-${month}-${day}`;

            if (!marks[dateISO]) {
              marks[dateISO] = {
                quantidade: 1,
                cor: data.gradient ? data.gradient[0] : '#6b0dc4',
              };
            } else {
              marks[dateISO].quantidade += 1;
            }
          }
        });

        setMarkedDates(marks);
      });

      return () => unsubscribe();
    }
  }, []);

  // 3. Busca dados do usuário
  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "usuarios", user.uid);
          const snapshot = await getDoc(userRef);

          if (snapshot.exists()) {
            const dados = snapshot.data();
            setUserName(dados.nome);
            setUserPhoto(dados.foto || null);
          }
        }
      } catch (error) {
        console.log("Erro ao carregar perfil:", error);
      }
    };
    getUserData();
  }, []);

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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          
          {/* Header Usuário */}
          <View style={style.boxTop}>
            <View style={style.textUser}>
              <Text style={style.Text}>Olá,</Text>
              <Text style={style.Usuario}>{userName}</Text>
            </View>

            {/* Lógica da Foto ou Inicial */}
            {userPhoto ? (
              <Image source={{ uri: userPhoto }} style={style.userFoto} />
            ) : (
              <View style={[style.userFoto, { 
                backgroundColor: '#6b0dc4', 
                justifyContent: 'center', 
                alignItems: 'center',
                borderWidth: 0 // Garante que não herde bordas indesejadas do estilo base
              }]}>
                <Text style={{ 
                  color: '#FFF', 
                  fontSize: 20, 
                  fontWeight: 'bold',
                  textTransform: 'uppercase' 
                }}>
                  {userName.charAt(0)}
                </Text>
              </View>
            )}
          </View>

          {/* Calendário */}
          <View style={{ paddingHorizontal: 20, marginTop: -10 }}>
            <Calendario 
              aoSelecionarData={(data: Date) => setDataFiltro(data)} 
              datasMarcadas={markedDates}
            />
          </View>

          {/* Título Seção */}
          <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 10 }}>
            <Text style={style.tituloSecao}>Tarefas</Text>
          </View>

          {/* Lista de Tarefas */}
          <View style={{ flex: 1 }}>
            {tasks.length > 0 ? (
              <BlurCarousel
                data={tasks}
                renderItem={({ item }: any) => (
                  <TaskCard
                    item={item}
                    fontLoaded={true}
                    onDelete={() => handleDeleteTask(item.id)}
                    onPress={() => router.push({ pathname: "/ver-tarefa", params: { id: item.id } })}
                  />
                )}
              />
            ) : (
              <TouchableOpacity
                style={[style.cardVazio, { marginHorizontal: 20, marginTop: 10 }]}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: "/criar-tarefa", params: { id: 'novo' } })}
              >
                <View style={style.iconBackgroundVazio}>
                  <MaterialIcons name="add" size={40} color="#6b0dc4" />
                </View>
                <Text style={style.cardVazioText}>Tudo limpo por aqui!</Text>
                <Text style={style.cardVazioSub}>Toque para organizar seu dia</Text>
              </TouchableOpacity>
            )}
          </View>

        </ScrollView>

        {/* Botão Flutuante (FAB) */}
        <TouchableOpacity
          style={style.fab}
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/criar-tarefa", params: { id: 'novo' } })}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#994bc7', '#6b0dc4']}
            style={style.fabGradient} 
          >
            <MaterialIcons name="add" size={32} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}