import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from "../../firebaseConfig" 
import { format } from 'date-fns';

export default function ListaTarefas({ dataFiltro }) {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    const dataFormatada = format(dataFiltro, 'yyyy-MM-dd'); // Formato do seu banco
    const q = query(
      collection(db, "tarefas"),
      where("userId", "==", auth.currentUser?.uid),
      where("data", "==", dataFormatada)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTarefas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [dataFiltro]);

  return (
    <View style={{ marginTop: 20 }}>
      {tarefas.map(t => (
        <View key={t.id} style={{ backgroundColor: '#1A1A1A', padding: 15, borderRadius: 15, marginBottom: 10 }}>
          <Text style={{ color: '#FFF' }}>{t.titulo}</Text>
        </View>
      ))}

    </View>
  );
}