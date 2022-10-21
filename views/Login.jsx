import React, { useState, useEffect } from 'react'
import {
    NativeBaseProvider, Box, Heading, Input, Text, Stack, extendTheme,
    VStack, FormControl, Button, HStack, Link, Center, ScrollView
} from 'native-base'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'



export default function Login({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("AdminPets")
            }
        })

        return unsubscribe
    }, [])

    const sendRegister = () => {
        navigation.navigate("Register")
    }

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with:', user.email);
            })
            .catch(error => alert(error.message))
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
                                onChangeText={e => setEmail(e)} />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Password</FormControl.Label>
                            <Input type="password" placeholder='Escriba su Password' value={password}
                                onChangeText={e => setPassword(e)} />
                            <Link _text={{
                                fontSize: "xs",
                                fontWeight: "500",
                                color: "indigo.500"
                            }} alignSelf="flex-end" mt="1">
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
        </NativeBaseProvider>
    )
}