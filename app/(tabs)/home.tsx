import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'; // Importamos Image
import { style } from "../style"
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig"
import { doc, getDoc } from 'firebase/firestore';

export default function Home() {
  const [userName, setUserName] = useState("...");
  const [userPhoto, setUserPhoto] = useState(null); 

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, "usuarios", user.uid);
          const snapshot = await getDoc(userDoc);

          if (snapshot.exists()) {
            const dados = snapshot.data();
            setUserName(dados.nome); // Pega o nome do firestore
            setUserPhoto(dados.foto); // Pega a foto do firestore
          } else {
            console.log("Documento não encontrado no Firestore!");
            setUserName("Usuário");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    getUserData();
  }, []);

  return (
    <View style={style.boxTop}>

      <View style={style.textUser}>
        <View>
          <Text style={style.Text}>Olá, </Text>
          <Text style={style.Usuario}>{userName}</Text>
        </View>

      </View>
      
      
    </View>
  );
}