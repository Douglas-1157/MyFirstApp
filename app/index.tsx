import { Link } from 'expo-router';
import { Input } from "@/components/Input";
import { StoryScript_400Regular, useFonts } from '@expo-google-fonts/story-script';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { style } from "./styles";
import { useNavigation } from 'expo-router'; //para poder navegar entre as paginas


export default function Login() {

    //comentei isso pois n é mais necessario, serve pra remover a barra de navegação. mas foi removida no _layout.tsx, porem, dx ai pra dar uma olhada dps, caso precise

    {/*const navigation = useNavigation();
    React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Remove a barra de navegação somente na tela de login
    });
  }, [navigation]); */}




    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // visibilidade da senha
    const [fontsLoaded] = useFonts({ StoryScript_400Regular }); // Carrega a fonte pae



    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />; // Exibe um indicador d q ta carregando
    }


    async function getLogin() {
        try {
            setLoading(true);

            if (!email || !password) {
                setLoading(false); // Importante resetar o icone de loading se ngm digitar nada ou se falhar
                return Alert.alert('Atenção!', 'Informe os campos obrigatórios!');
            }

            // Simulação de verificação
            setTimeout(() => {
                if (email === 'dodo69marques@gmail.com' && password === 'kauaebonito') {
                    router.replace('/home');  // Navega para a Home
                    console.log('Logado com sucesso!')
                } else {
                    Alert.alert('Erro', 'Usuário ou senha incorretos!');
                    console.log('Tente novamente')
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
                    secureTextEntry={!isPasswordVisible} // Controle de visibilidade
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

                <Text style={style.TextRecovery}>Esqueceu a <Text style={style.TextRecoveryColor}>Senha?</Text></Text>
                <Text style={style.TextBottom}>Não tem conta? <Link href="/profile" style={style.TextBottomCreate}>Crie agora!</Link></Text>


            </View>
        </LinearGradient>
    );
}