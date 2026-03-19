import { router } from 'expo-router';
import { Input } from "@/components/Input";
import { StoryScript_400Regular, useFonts } from '@expo-google-fonts/story-script';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Importar o Picker
import { style } from "./styles";
import { StatusBar } from "expo-status-bar";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [image, setImage] = useState<string | null>(null); // Estado para a imagem
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [fontsLoaded] = useFonts({ StoryScript_400Regular });

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Função para selecionar a imagem
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão necessária", "Precisamos de acesso às suas fotos para continuar."); //n ta aparecendo na tela...
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    async function getLogin() {
        try {
            setLoading(true);

            if (!email || !password || !user) {
                setLoading(false);
                return Alert.alert('Atenção!', 'Informe os campos obrigatórios!');
            }

            setTimeout(() => {
                if (email === 'a' && password === 'a' && user === 'Douglas') {
                    router.replace('/');
                    console.log('Conta criada com sucesso!');
                } else {
                    Alert.alert('Erro', 'Usuário ou senha inválidos!');
                }
                setLoading(false);
            }, 2000);

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    return (
        <LinearGradient colors={['#ffffff', '#fff']} style={style.Container}>
            <StatusBar style="dark" />

            <View style={style.boxTop}>
                <TouchableOpacity onPress={pickImage} style={style.containerFoto}>
                    <View style={style.circuloFoto}>
                        {image ? (
                            <Image source={{ uri: image }} style={style.imageFoto} />
                        ) : (
                            <FontAwesome name="user" size={60} color="#6b0dc4" />
                        )}

                        <View style={style.iconPlus}>
                            <MaterialCommunityIcons name="plus" size={16} color="#ffffff" />
                        </View>
                    </View>
                </TouchableOpacity>

                <Text style={style.text}>Crie sua conta!</Text>
            </View>

            <View style={style.boxInput}>
                <TextInput
                    style={style.Input}
                    value={user}
                    onChangeText={setUser}
                    placeholder='Usuário'
                />
                <FontAwesome
                    name="user-o"
                    size={20}
                    color='#6b0dc4'
                />
            </View>

            <Input
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
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
                            <Text style={style.TextButton}>CADASTRAR-SE</Text>
                        )}
                    </TouchableOpacity>
                </LinearGradient>

                <Text style={style.TextRecovery}>
                    Seus dados estarão <Text style={style.TextRecoveryColorProfile}>seguros!</Text>
                </Text>

                <View style={style.BoxText}>
                    <Text style={style.TextBottom}>Já tem conta?</Text>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={style.TextBottomCreate}> Faça login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}