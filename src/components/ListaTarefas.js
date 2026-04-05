import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from "../../firebaseConfig";
import { format } from 'date-fns';

export default function ListaTarefas({ dataFiltro }) {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    // 1. O formato tem que ser IDÊNTICO ao que você salva no banco
    const dataFormatada = format(dataFiltro, 'dd-MM-yyyy'); 

    // 2. BUSCA NA COLEÇÃO "tasks" (como está no seu Home)
    const q = query(
      collection(db, "tasks"), 
      where("userId", "==", auth.currentUser?.uid),
      where("date", "==", dataFormatada) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTarefas(lista);
    }, (error) => {
      console.log("Erro ao carregar lista:", error);
    });

    return () => unsubscribe();
  }, [dataFiltro]);

  return (
    <View style={{ marginTop: 20 }}>
      {tarefas.length > 0 ? (
        tarefas.map(t => (
          <View key={t.id} style={styles.card}>
            <Text style={styles.texto}>{t.title || t.titulo}</Text>
            {t.description && (
              <Text style={styles.subtexto}>{t.description}</Text>
            )}
          </View>
        ))
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6b0dc4'
  },
  texto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600'
  },
  subtexto: {
    color: '#BBB',
    fontSize: 12,
    marginTop: 4
  }
});