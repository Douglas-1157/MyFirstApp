import { Link, router } from 'expo-router';
import { Input } from "@/components/Input";
import { StoryScript_400Regular, useFonts } from '@expo-google-fonts/story-script';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { style } from "./styles";
import { StatusBar } from "expo-status-bar";
import { db } from '../firebaseConfig'; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [fontsLoaded] = useFonts({ StoryScript_400Regular });

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    async function getLogin() {
        try {
            setLoading(true);

            if (!email || !password) {
                setLoading(false);
                return Alert.alert('Atenção!', 'Informe os campos obrigatórios!');
            }

            const auth = getAuth();
            const usersRef = collection(db, "usuarios");
            const valorDigitado = email.trim();
            let emailFinal = valorDigitado;

            if (!valorDigitado.includes('@')) {
                const q = query(usersRef, where("nome", "==", valorDigitado));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setLoading(false);
                    return Alert.alert('Erro', 'Usuário não encontrado!');
                }
                // Pega o email real vinculado a esse nome
                emailFinal = querySnapshot.docs[0].data().email;
            }

            await signInWithEmailAndPassword(auth, emailFinal, password);

            console.log('Logado com sucesso!');
            router.replace('/home');

        } catch (error: any) {
            console.error("Erro no login:", error.code);
            
            // msgs de erro
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
                Alert.alert('Erro', 'E-mail/Usuário ou senha incorretos.');
            } else if (error.code === 'auth/too-many-requests') {
                Alert.alert('Erro', 'Muitas tentativas. Tente novamente mais tarde.');
            } else {
                Alert.alert('Erro', 'Problema na conexão ou dados inválidos.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <LinearGradient colors={['#fff', '#fff']} style={style.Container}>
            <StatusBar style="dark" />
            <View style={style.boxTop}>
                <Image
                    source={require('../app/(tabs)/boneca.png')}
                    style={style.image}
                />
                <Text style={style.text}>Bem-vindo!</Text>
            </View>

            <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Usuário ou E-mail"
                IconRight={MaterialIcons}
                iconRightName="email"
            />

            <View style={style.boxInput}>
                <TextInput
                    style={style.Input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Senha"
                    secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <MaterialIcons
                        name={isPasswordVisible ? "visibility" : "visibility-off"}
                        size={20}
                        color='#6b0dc4'
                    />
                </TouchableOpacity>
            </View>

            <View style={style.boxBottom}>
                <LinearGradient
                    start={{ x: 0.0, y: 0.25 }}
                    end={{ x: 0.5, y: 1.0 }}
                    colors={['#994bc7', '#6b0dc4']}
                    style={style.Button}>
                    <TouchableOpacity style={style.ButtonContent} onPress={() => getLogin()}>
                        {loading ? (
                            <ActivityIndicator color={'#fff'} size={"small"} />
                        ) : (
                            <Text style={style.TextButton}>LOGIN</Text>
                        )}
                    </TouchableOpacity>
                </LinearGradient>

                <View style={style.recoveryContainer}>
                    <Text style={style.TextRecovery}>Esqueceu a </Text>
                    <TouchableOpacity onPress={() => router.push('/recovery')}>
                        <Text style={style.TextRecoveryColor}>senha?</Text>
                    </TouchableOpacity>
                </View>

                <Text style={style.TextBottom}>Não tem conta?</Text>
                <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Text style={style.TextBottomCreate}>Crie agora!</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}