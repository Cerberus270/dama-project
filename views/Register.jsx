import React, { useEffect } from 'react'
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
} from "native-base"

// Validation Imports
import * as yup from 'yup';
import { Formik } from 'formik';

// Firebase Auth
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';


export default function Register({ navigation }) {

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("AdminPets")
            }
        })

        return unsubscribe
    }, [])


    const sendData = async (values) => {
        const { email, password } = values;
        createUserWithEmailAndPassword(auth, email, password)
            .then((re) => {
                console.log(re);
            })
            .catch((re) => {
                console.log(re);
            })
        console.log(values);
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
                                .email()
                                .required('Campo requerido.'),
                            name: yup
                                .string()
                                .required('Campo requerido.'),
                            password: yup
                                .string()
                                .required('Campo requerido.'),
                            passwordConfirm: yup
                                .string()
                                .oneOf([yup.ref('password'), null], 'Passwords must match')
                        })}>
                        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                            <View>
                                <VStack space={4} mt="5">
                                    <FormControl isInvalid={'email' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Email</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Escriba su Email'
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
                                            value={values.password}
                                            type="password"
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
                                            type="password"
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