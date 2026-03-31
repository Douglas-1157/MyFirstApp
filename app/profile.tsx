import { router } from 'expo-router';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import * as ImageManipulator from 'expo-image-manipulator'; 
import { style } from "./styles";
import { StatusBar } from "expo-status-bar";
import { db } from './../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Cadastro() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [image, setImage] = useState<string | null>(null); 
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão necessária", "Precisamos de acesso às suas fotos.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: true, 
            aspect: [1, 1], 
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const processarImagem = async (uri: string) => {
        try {
            const manipResult = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 200, height: 200 } }], 
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
            );
            return `data:image/jpeg;base64,${manipResult.base64}`;
        } catch (error) {
            return null;
        }
    };

    async function handleRegister() {
        if (!email || !password || !user || !image) {
            return Alert.alert('Atenção!', 'Preencha todos os campos e selecione uma foto!');
        }

        try {
            setLoading(true);
            const fotoBase64 = await processarImagem(image);
            if (!fotoBase64) throw new Error("Erro no processamento");

            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userAuth = userCredential.user;

            await setDoc(doc(db, "usuarios", userAuth.uid), {
                nome: user,
                email: email,
                foto: fotoBase64,
                uid: userAuth.uid, 
                criadoEm: new Date()
            });

            Alert.alert('Sucesso!', 'Conta criada com sucesso!');
            router.replace('/');
        } catch (error: any) {
            Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={style.Container}>
            <StatusBar style="dark" />

            <View style={style.boxTop}>
                <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
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
                <Text style={style.textTitle}>Criar conta</Text>
                <Text style={style.textSubtitle}>Comece a organizar sua vida</Text>
            </View>

            <View style={style.boxMid}>
                <View style={style.boxInput}>
                    <FontAwesome name="user-o" size={18} color='#999' />
                    <TextInput
                        style={style.Input}
                        value={user}
                        onChangeText={setUser}
                        placeholder='Usuário'
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={style.boxInput}>
                    <MaterialIcons name="email" size={18} color='#999' />
                    <TextInput
                        style={style.Input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder='Email'
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={style.boxInput}>
                    <MaterialIcons name="lock-outline" size={18} color='#999' />
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
                            size={18}
                            color='#999'
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={style.boxBottom}>
                <TouchableOpacity onPress={handleRegister} activeOpacity={0.8}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#994bc7', '#6b0dc4']}
                        style={style.Button}
                    >
                        {loading ? (
                            <ActivityIndicator color={'#fff'} size={"small"} />
                        ) : (
                            <Text style={style.TextButton}>CADASTRE-SE</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
                
                <Text style={style.textInfo}>Seus dados estarão seguros!</Text>

                <View style={style.footerContainer}>
                    <Text style={style.TextBottom}>Já tem conta?</Text>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Text style={style.TextBottomCreate}> Entrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}