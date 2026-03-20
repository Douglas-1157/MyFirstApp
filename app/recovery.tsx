import { router } from 'expo-router';
import { Input } from "@/components/Input";
import { StoryScript_400Regular, useFonts } from '@expo-google-fonts/story-script';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import { style } from "./styles";
import { StatusBar } from "expo-status-bar";
import { db } from './../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";


export default function Login() {
    //esses estados aq e pra guardar oq o usuario digitar
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [fontsLoaded] = useFonts({ StoryScript_400Regular });

    //se a fonte n carregar, mostra um icone de loading na tela ate carregar
    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
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
            />


            <View style={style.boxBottom}>
                <LinearGradient
                    start={{ x: 0.0, y: 0.25 }}
                    end={{ x: 0.5, y: 1.0 }}
                    colors={['#994bc7', '#6b0dc4']}
                    style={style.Button}>
                    <TouchableOpacity style={style.ButtonContent}>
                        {loading ? (
                            <ActivityIndicator color={'#fff'} size={"small"} />
                        ) : (
                            <Text style={style.TextButton}>ENVIAR CÓDIGO</Text>
                        )}
                    </TouchableOpacity>
                </LinearGradient>

                <Text style={style.TextRecovery}>
                    Envia um codigo pro seu email <Text style={style.TextRecoveryColorProfile}>cadastrado!</Text>
                </Text>

                <View style={style.BoxText}>
                    <Text style={style.TextBottomRecovery}>Lembrou a conta?</Text>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={style.TextBottomCreateRecovery}> Faça login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}


