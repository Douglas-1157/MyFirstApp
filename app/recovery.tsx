import { router } from 'expo-router';
import { Input } from "@/components/Input";
import { StoryScript_400Regular, useFonts } from '@expo-google-fonts/story-script';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { style } from "./styles";
import { StatusBar } from "expo-status-bar";
import { getAuth, sendPasswordResetEmail } from "firebase/auth"; 

export default function Recovery() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [fontsLoaded] = useFonts({ StoryScript_400Regular });

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
            //aparece o erro no cmd
            console.error("ERRO COMPLETO:", error.code, error.message);

            if (error.code === 'auth/user-not-found') {
                Alert.alert("Erro", "E-mail não encontrado.");
            } else if (error.code === 'auth/too-many-requests') {
                Alert.alert("Erro", "Muitas tentativas. Tente novamente mais tarde.");
            } else {
                Alert.alert("Erro", "Falha ao enviar. Verifique sua conexão.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#6b0dc4" style={{ flex: 1 }} />;
    }

    return (
        <LinearGradient colors={['#ffffff', '#fff']} style={style.Container}>
            <StatusBar style="dark" />

            <View style={style.boxTop}>
                <Text style={style.text}>Recupere sua senha!</Text>
            </View>

            <Input
                placeholder='Email cadastrado'
                value={email}
                onChangeText={setEmail}
                IconRight={MaterialIcons}
                iconRightName="email"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <View style={style.boxBottom}>
                <LinearGradient
                    start={{ x: 0.0, y: 0.25 }}
                    end={{ x: 0.5, y: 1.0 }}
                    colors={['#994bc7', '#6b0dc4']}
                    style={style.Button}>

                    <TouchableOpacity
                        style={style.ButtonContent}
                        onPress={handleSendCode}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={'#fff'} size={"small"} />
                        ) : (
                            <Text style={style.TextButton}>ENVIAR LINK</Text>
                        )}
                    </TouchableOpacity>
                </LinearGradient>

                <View style={style.mensagemRecovery}>
                    <Text style={style.TextRecovery}>
                        Enviaremos um link seguro para o seu <Text style={style.TextRecoveryColorProfile}>email!</Text>
                    </Text>
                </View>

                <View style={style.BoxText}>
                    <Text style={style.TextBottomRecovery}>Lembrou a senha?</Text>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={style.TextBottomCreateRecovery}> Faça login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}