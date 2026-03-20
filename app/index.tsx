import { Link } from 'expo-router';
import { Input } from "@/components/Input";
import { StoryScript_400Regular, useFonts } from '@expo-google-fonts/story-script';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View, Pressable } from 'react-native';
import { style } from "./styles";
import { useNavigation } from 'expo-router'; //para poder navegar entre as paginas
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useTheme } from "@react-navigation/native";
import { db } from '../firebaseConfig'; // Ajuste o caminho se necessário
import { collection, query, where, getDocs } from "firebase/firestore";


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // visibilidade da senha
    const [fontsLoaded] = useFonts({ StoryScript_400Regular }); // Carrega a fonte 

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />; // Exibe um indicador visual de loading
    }

    //função pra fzr o login

    async function getLogin() {
    try {
        setLoading(true);

        if (!email || !password) {
            setLoading(false);
            return Alert.alert('Atenção!', 'Informe os campos obrigatórios!');
        }

        const usersRef = collection(db, "usuarios");
        const valorDigitado = email.trim();

        //busca o email
        let q = query(usersRef, where("email", "==", valorDigitado));
        let querySnapshot = await getDocs(q);

        // se n achar o email, busca o usuario
        if (querySnapshot.empty) {
            q = query(usersRef, where("nome", "==", valorDigitado));
            querySnapshot = await getDocs(q);
        }

        // se n tiver nd
        if (querySnapshot.empty) {
            setLoading(false);
            return Alert.alert('Erro', 'Usuário ou E-mail não encontrado!');
        }

        const userData = querySnapshot.docs[0].data();

        // verifica a senha
        if (userData.senha === password) {
            console.log('Logado com sucesso!');
            router.replace('/home');
        } else {
            Alert.alert('Erro', 'Senha incorreta!');
        }

        //se tiver erro no login
    } catch (error) {
        console.error("Erro no login:", error);
        Alert.alert('Erro', 'Houve um problema na conexão.');
    } finally {
        setLoading(false);
    }
}

    return (
   
        <LinearGradient colors={['#fff', '#fff']} style={style.Container}>
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
                IconRight={MaterialIcons}
                iconRightName="email"

            />

            {/*<Text style={style.titleInput}>SENHA</Text> */}
            <View style={style.boxInput}>
                <TextInput
                    style={style.Input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Senha"
                    secureTextEntry={!isPasswordVisible} // visibilidade
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <MaterialIcons
                        name={isPasswordVisible ? "visibility" : "visibility-off"} // serve pra muda o ícone de olho
                        size={20}
                        color='#6b0dc4'
                    />
                </TouchableOpacity>
            </View>

            {/*parte componentizada, deixar comentado pra consultar dps*/}

            {/* <View style={style.boxMid}>
                {/* <Text style={style.titleInput}>ENDEREÇO DE E-MAIL</Text> 
               <View style={style.boxInput}>
                         <TextInput 
                            style={style.Input} 
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Usuario ou Email"
                        />
                        <MaterialIcons
                            name="email"
                            size={20}
                            color='#6b0dc4'
                        />
                    </View>

                    {/* <Text style={style.titleInput}>SENHA</Text> 
                    <View style={style.boxInput}>
                        <TextInput 
                            style={style.Input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Senha"
                            secureTextEntry={!isPasswordVisible} // Controle de visibilidade
                        />
                        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <MaterialIcons
                                name={isPasswordVisible ? "visibility-off" : "visibility"} // serve pra muda o ícone de olho
                                size={20}
                                color='#6b0dc4'
                            />
                        </TouchableOpacity> 
                </View>
            </View>*/}

            <View style={style.boxBottom}>

                <LinearGradient
                    start={{ x: 0.0, y: 0.25 }}
                    end={{ x: 0.5, y: 1.0 }}
                    locations={[0.0, 1.0]}
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

                <Text style={style.TextRecovery}>Esqueceu a <Text style={style.TextRecoveryColor}>senha?</Text></Text>
                <Text style={style.TextBottom}> 
                    Não tem conta?
                </Text>
                    <TouchableOpacity onPress={() => router.push('/profile')}>
                        <Text style={style.TextBottomCreate}>Crie agora!</Text>
                    </TouchableOpacity>
                


            </View>
        </LinearGradient>

                        
                

    );
}