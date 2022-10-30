import React, { useEffect, useState } from 'react'
// Components Imports
import {
    NativeBaseProvider,
    ScrollView,
    Box,
    Heading,
    VStack,
    FormControl,
    Input,
    Button,
    View,
    WarningOutlineIcon,
    Icon,
    Pressable
} from "native-base"

// Validation Imports
import * as yup from 'yup';
import { Formik } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Firebase Auth
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';


export default function Register({ navigation }) {

    const [show, setShow] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("AdminPets");
            }
        })

        return unsubscribe
    }, [])


    const sendData = async (values) => {
        const { email, password } = values;
        createUserWithEmailAndPassword(auth, email, password)
            .then((response) => {
                console.log(response);
                alert("Usuario Creado Correctamente");
            })
            .catch((error) => {
                console.log(error);
                alert("Error al crear el usuario");
            })
    }
    return (
        <NativeBaseProvider>
            <ScrollView>
                <Box w={"95%"} mt={8} flex={1} p={1} marginLeft={1}>
                    <Heading size="lg" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }} fontWeight="semibold">
                        Bienvenido
                    </Heading>
                    <Heading mt="1" color="coolGray.600" _dark={{
                        color: "warmGray.200"
                    }} fontWeight="medium" size="xs">
                        ¡Registrate para Continuar!
                    </Heading>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                            passwordConfirm: '',
                            name: '',
                        }}
                        onSubmit={values => sendData(values)}
                        validationSchema={yup.object().shape({
                            email: yup
                                .string()
                                .email('Ingrese un email válido.')
                                .required('Email requerido.'),
                            name: yup
                                .string()
                                .required('Nombre requerido.'),
                            password: yup
                                .string()
                                .min(6, "La contraseña debe tener al menos 6 caracteres.")
                                .required('Contraseña requerida.'),
                            passwordConfirm: yup
                                .string()
                                .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir.')
                        })}>
                        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                            <View>
                                <VStack space={4} mt="5">
                                    <FormControl isInvalid={'email' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Email</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Escriba su Email'
                                            InputLeftElement={<Icon as={<MaterialCommunityIcons name="gmail" />} size={5} ml="2" color="muted.400" />}
                                            value={values.email}
                                            keyboardType={'email-address'}
                                            onChangeText={handleChange('email')}
                                            onBlur={() => setFieldTouched('email')} />
                                        {touched.email && errors.email &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {errors.email}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl isInvalid={'name' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Nombre</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Escriba su Nombre'
                                            InputLeftElement={<Icon as={<MaterialCommunityIcons name="account-cowboy-hat" />} size={5} ml="2" color="muted.400" />}
                                            value={values.name}
                                            onChangeText={handleChange('name')}
                                            onBlur={() => setFieldTouched('name')} />
                                        {touched.name && errors.name &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {errors.name}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl isInvalid={'password' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Password</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Escriba su Password'
                                            type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
                                                <Icon as={<MaterialCommunityIcons name={show ? "eye-outline" : "eye-off-outline"} />} size={5} mr="2" color="muted.400" />
                                            </Pressable>}
                                            value={values.password}
                                            onChangeText={handleChange('password')}
                                            onBlur={() => setFieldTouched('password')} />
                                        {touched.password && errors.password &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {errors.password}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl isInvalid={'passwordConfirm' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Confirm Password</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Repita su Password'
                                            value={values.passwordConfirm}
                                            type={show ? "text" : "password"}
                                            onChangeText={handleChange('passwordConfirm')}
                                            onBlur={() => setFieldTouched('passwordConfirm')} />
                                        {touched.passwordConfirm && errors.passwordConfirm &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {errors.passwordConfirm}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <Button mt="2" colorScheme="indigo" onPress={handleSubmit} _disabled={styles.botonDisabled}>
                                        Sign up
                                    </Button>
                                </VStack>
                            </View>
                        )}
                    </Formik>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = {
    inputSeleccionado: {
        bg: "coolGray.200:alpha.100"
    },
    botonDisabled: {
        backgroundColor: '#00aeef'
    },
    labelInput: {
        color: 'black',
        fontSize: 'sm',
        fontWeight: 'bold'
    },
    tituloForm: {
        color: '#8796FF'
    }
}