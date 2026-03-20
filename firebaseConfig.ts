import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { LogBox } from 'react-native';

// Suas chaves de configuração
const firebaseConfig = {
  apiKey: "AIzaSyCHPgx4V1MCLnX9Qq3Xmy6DMgRwbMoy1V0",
  authDomain: "uply-c1b62.firebaseapp.com",
  projectId: "uply-c1b62",
  storageBucket: "uply-c1b62.firebasestorage.app",
  messagingSenderId: "929382991443",
  appId: "1:929382991443:web:0186559f4afa5bb9c128a6",
  measurementId: "G-G4CQGCHG4J"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o que vamos usar nas telas
export const auth = getAuth(app);
export const db = getFirestore(app);

// Mata o aviso chato do AsyncStorage que aparece no terminal
LogBox.ignoreLogs(['@firebase/auth: Auth (12.11.0):']);