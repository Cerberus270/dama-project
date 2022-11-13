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
    Icon,
    WarningOutlineIcon,
} from "native-base"

// Validation Imports
import * as yup from 'yup';
import { Formik } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Firebase Auth
import { auth } from "../../../config/firebase"
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const ResetPassword = ({ navigation }) => {
    const sendData = (values) => {
        const { email } = values;
        sendPasswordResetEmail(auth, email)
            .then((response) => {
                console.log(response);
                alert("Revise su email para cambiar la password");
                navigation.goBack();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                alert("Error al enviar el email");
            });
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
                    }} fontWeight="medium" size="sm">
                        Cambiar Contraseña Aqui
                    </Heading>
                    <Formik
                        initialValues={{
                            email: ''
                        }}
                        onSubmit={values => sendData(values)}
                        validationSchema={yup.object().shape({
                            email: yup
                                .string()
                                .email('Ingrese un email válido.')
                                .required('Campo requerido.'),
                        })}>
                        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                            <View>
                                <VStack space={4} mt="5">
                                    <FormControl isInvalid={'email' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Email</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Escriba su Email'
                                            InputLeftElement={<Icon as={<MaterialCommunityIcons name="account" />} size={5} ml="2" color="muted.400" />}
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
                                    <Button mt="2" colorScheme="indigo" onPress={handleSubmit} _disabled={styles.botonDisabled}>
                                        Cambiar Contraseña
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

export default ResetPassword;