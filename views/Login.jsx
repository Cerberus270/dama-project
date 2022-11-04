import React, { useState, useEffect } from 'react'
import {
    NativeBaseProvider, Box, Heading, Input, Text, Stack, extendTheme, Icon,
    VStack, FormControl, Button, HStack, Link, Center, ScrollView, Pressable
} from 'native-base'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { MaterialCommunityIcons } from '@expo/vector-icons';



export default function Login({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);

    const erroresLogin = errores => {
        console.log("ea ", errores)
        const defecto = "Otro tipo de error";
        const listaErrores = {
            "auth/invalid-email": "El correo ingresado no es valido, intente de nuevo",
            "auth/user-not-found": "El correo ingresado no tiene ninguna cuenta asociada",
            "auth/wrong-password": "La contraseña ingresada no es valida",
            "auth/user-disabled": "Su cuenta esta deshabilitada, por favor contactenos",
            "auth/too-many-requests": "Muchas peticiones, por favor espere"
        }
        return listaErrores[errores] ?? defecto;
    }

    const sendRegister = () => {
        navigation.navigate("Register")
    }

    const sendReset = () => {
        navigation.navigate("ResetPassword")
    }

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with:', user.email);
            })
            .catch(error => {
                console.log(error.code);
                alert(erroresLogin(error.code));
            });
    }
    return (
        <NativeBaseProvider>
            <ScrollView>
                <Box w={"95%"} mt={8} flex={1} p={1} marginLeft={1}>
                    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }}>
                        Bienvenido
                    </Heading>
                    <Heading mt="1" _dark={{
                        color: "warmGray.200"
                    }} color="coolGray.600" fontWeight="medium" size="xs">
                        ¡Inicia sesión para continuar!
                    </Heading>

                    <VStack space={3} mt="5">
                        <FormControl>
                            <FormControl.Label>Email ID</FormControl.Label>
                            <Input placeholder='Escriba su Email' value={email}
                                InputLeftElement={<Icon as={<MaterialCommunityIcons name="account" />} size={5} ml="2" color="muted.400" />}
                                onChangeText={e => setEmail(e)} />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Password</FormControl.Label>
                            <Input placeholder='Escriba su Password' value={password}
                                onChangeText={e => setPassword(e)}
                                type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
                                    <Icon as={<MaterialCommunityIcons name={show ? "eye-outline" : "eye-off-outline"} />} size={5} mr="2" color="muted.400" />
                                </Pressable>}
                            />
                            <Link _text={{
                                fontSize: "xs",
                                fontWeight: "500",
                                color: "indigo.500"
                            }} alignSelf="flex-end" mt="1"
                                onPress={sendReset}>
                                ¿Olvido la contraseña?
                            </Link>
                        </FormControl>
                        <Button mt="2" colorScheme="indigo" onPress={login}>
                            Sign in
                        </Button>
                        <HStack mt="6" justifyContent="center">
                            <Text fontSize="sm" color="coolGray.600" _dark={{
                                color: "warmGray.200"
                            }}>
                                Soy un nuevo usuario.{" "}
                            </Text>
                            <Link _text={{
                                color: "indigo.500",
                                fontWeight: "medium",
                                fontSize: "sm"
                            }} onPress={sendRegister}>
                                Registrarse
                            </Link>
                        </HStack>
                    </VStack>
                </Box>
            </ScrollView>
        </NativeBaseProvider >
    )
}