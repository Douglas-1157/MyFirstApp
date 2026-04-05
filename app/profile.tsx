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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";

export default function Cadastro() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [image, setImage] = useState<string | null>(null); 
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Validação de Senha: 6+ caracteres, 1 MAIÚSCULA, 1 minúscula, 1 número e 1 especial
    const validarSenhaForte = (senha: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        return regex.test(senha);
    };

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
        // 1. Campos obrigatórios e limite de caracteres
        if (!email || !password || !user) {
            return Alert.alert('Atenção!', 'Preencha todos os campos obrigatórios!');
        }

        if (user.length > 15) {
            return Alert.alert('Usuário muito longo', 'O nome de usuário deve ter no máximo 15 caracteres.');
        }

        // 2. Validar Senha Forte (Maiúscula, Minúscula, Número e Especial)
        if (!validarSenhaForte(password)) {
            return Alert.alert(
                'Senha Fraca', 
                'A senha deve ter no mínimo 6 caracteres e conter:\n• Letra maiúscula\n• Letra minúscula\n• Número\n• Caractere especial (ex: @, #, $)'
            );
        }

        try {
            setLoading(true);

            // 3. Verificar se o NOME DE USUÁRIO já existe no Firestore
            const q = query(collection(db, "usuarios"), where("nome", "==", user.trim()));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setLoading(false);
                return Alert.alert('Erro', 'Este nome de usuário já está sendo usado por outra pessoa.');
            }

            // 4. Processar imagem se houver
            let fotoBase64 = null;
            if (image) {
                fotoBase64 = await processarImagem(image);
            }

            const auth = getAuth();
            
            // 5. Criar usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const userAuth = userCredential.user;

            // 6. Enviar e-mail de verificação
            await sendEmailVerification(userAuth);

            // 7. Salvar dados no Firestore
            await setDoc(doc(db, "usuarios", userAuth.uid), {
                nome: user.trim(),
                email: email.toLowerCase().trim(),
                foto: fotoBase64,
                uid: userAuth.uid, 
                criadoEm: new Date(),
            });

            Alert.alert(
                'Conta Criada!', 
                'Enviamos um e-mail de verificação. Por favor, confirme seu e-mail antes de fazer o primeiro login.',
                [{ text: 'OK', onPress: () => router.replace('/') }]
            );
            
        } catch (error: any) {
            console.log("Erro no cadastro:", error.code);
            
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('E-mail em uso', 'Este endereço de e-mail já está vinculado a outra conta.');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('E-mail Inválido', 'O formato do e-mail digitado não é válido.');
            } else {
                Alert.alert('Erro no Cadastro', 'Não foi possível criar sua conta agora. Tente novamente.');
            }
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
                <Text style={style.textTitle}>Crie sua conta</Text>
                <Text style={style.textSubtitle}>Comece a organizar a sua vida!</Text>
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
                        autoCapitalize="none"
                        maxLength={15}
                    />
                </View>

                <View style={style.boxInput}>
                    <MaterialIcons name="email" size={18} color='#999' />
                    <TextInput
                        style={style.Input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder='E-mail'
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
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
                <TouchableOpacity onPress={handleRegister} activeOpacity={0.8} disabled={loading}>
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