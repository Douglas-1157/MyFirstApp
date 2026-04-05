import { Link, router } from 'expo-router';
import { Input } from "@/components/Input";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { style } from "./styles";
import { StatusBar } from "expo-status-bar";
import { db } from '../firebaseConfig'; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"; // Adicionado signOut

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

            // Busca por Username se não tiver '@'
            if (!valorDigitado.includes('@')) {
                const q = query(usersRef, where("nome", "==", valorDigitado));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setLoading(false);
                    return Alert.alert('Erro', 'Usuário não encontrado!');
                }
                emailFinal = querySnapshot.docs[0].data().email;
            }

            // 1. Tenta autenticar
            const userCredential = await signInWithEmailAndPassword(auth, emailFinal, password);
            const user = userCredential.user;

            // 2. Trava de Verificação de E-mail
            if (!user.emailVerified) {
                await signOut(auth); // Desloga o usuário da sessão atual
                setLoading(false);
                return Alert.alert(
                    'E-mail não verificado', 
                    'Você precisa confirmar seu e-mail antes de entrar. Verifique sua caixa de entrada ou spam.'
                );
            }

            // 3. Se passou pela trava, vai para Home
            router.replace('/home');

        } catch (error: any) {
            console.error("Erro no login:", error.code);
            // Mensagem amigável para erro de senha ou usuário
            Alert.alert('Erro', 'E-mail/Usuário ou senha incorretos.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={style.Container}>
            <StatusBar style="dark" />
            
            <View style={style.boxTop}>
                <Text style={style.textTitle}>Entrar</Text>
                <Text style={style.textSubtitle}>Acesse sua conta</Text>
            </View>

            <View style={style.boxMid}>
                <View style={style.boxInput}>
                    <MaterialIcons name="person-outline" size={20} color="#999" />
                    <TextInput
                        style={style.Input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Usuário ou Email"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                    />
                </View>

                <View style={style.boxInput}>
                    <MaterialIcons name="lock-outline" size={20} color="#999" />
                    <TextInput
                        style={style.Input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Senha"
                        placeholderTextColor="#999"
                        secureTextEntry={!isPasswordVisible}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <MaterialIcons
                            name={isPasswordVisible ? "visibility" : "visibility-off"}
                            size={20}
                            color='#999'
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={style.recoveryButton} 
                    onPress={() => router.push('/recovery')}
                >
                    <Text style={style.TextRecoveryColor}>Esqueceu a senha?</Text>
                </TouchableOpacity>
            </View>

            <View style={style.boxBottom}>
                <TouchableOpacity onPress={() => getLogin()} activeOpacity={0.8} disabled={loading}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#994bc7', '#6b0dc4']}
                        style={style.Button}
                    >
                        {loading ? (
                            <ActivityIndicator color={'#fff'} size={"small"} />
                        ) : (
                            <Text style={style.TextButton}>ENTRAR</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <View style={style.footerContainer}>
                    <Text style={style.TextBottom}>Não tem conta? </Text>
                    <TouchableOpacity onPress={() => router.push('/profile')}>
                        <Text style={style.TextBottomCreate}>Crie agora!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}