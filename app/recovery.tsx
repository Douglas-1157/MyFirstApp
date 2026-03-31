import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { style } from "./styles";
import { StatusBar } from "expo-status-bar";
import { getAuth, sendPasswordResetEmail } from "firebase/auth"; 

export default function Recovery() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        if (!email.includes('@')) {
            Alert.alert("E-mail inválido", "Por favor, digite um e-mail correto.");
            return;
        }

        setLoading(true);
        const auth = getAuth();

        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Sucesso!", "Se o e-mail estiver cadastrado, você receberá o link em instantes.");
            router.replace('/');
        } catch (error: any) {
            console.error("ERRO COMPLETO:", error.code, error.message);
            if (error.code === 'auth/user-not-found') {
                Alert.alert("Erro", "E-mail não encontrado.");
            } else {
                Alert.alert("Erro", "Falha ao enviar. Verifique sua conexão.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={style.Container}>
            <StatusBar style="dark" />

            <View style={style.boxTop}>
                <Text style={style.textTitle}>Recuperar senha</Text>
                <Text style={style.textSubtitle}>Enviaremos um link para o seu e-mail</Text>
            </View>

            <View style={style.boxMid}>
                <View style={style.boxInput}>
                    <MaterialIcons name="email" size={20} color="#999" />
                    <TextInput
                        style={style.Input}
                        placeholder='E-mail cadastrado'
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            </View>

            <View style={style.boxBottom}>
                <TouchableOpacity onPress={handleSendCode} disabled={loading} activeOpacity={0.8}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#994bc7', '#6b0dc4']}
                        style={style.Button}
                    >
                        {loading ? (
                            <ActivityIndicator color={'#fff'} size={"small"} />
                        ) : (
                            <Text style={style.TextButton}>ENVIAR LINK</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={style.textInfo}>Verifique sua caixa de spam!</Text>

                <View style={style.footerContainer}>
                    <Text style={style.TextBottom}>Lembrou a senha? </Text>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={style.TextBottomCreate}>Entrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}