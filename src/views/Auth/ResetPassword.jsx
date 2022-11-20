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
    HStack
} from "native-base"
import { Alert } from 'react-native';
import { Avatar } from "react-native-elements";

// Validation Imports
import * as yup from 'yup';
import { Formik } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Firebase Auth
import { auth } from "../../../config/firebase"
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const ResetPassword = ({ navigation }) => {

    const listadoErr = (errores) => {
        const defecto = "Ocurrio un error";
        const listaErrores = {
            "auth/invalid-email":
                "El correo ingresado no es valido, intente de nuevo",
            "auth/user-not-found":
                "El correo ingresado no tiene ninguna cuenta asociada",
            "auth/wrong-password": "La contraseña ingresada no es valida",
            "auth/user-disabled":
                "Su cuenta esta deshabilitada, por favor contactenos",
            "auth/too-many-requests": "Muchas peticiones, por favor espere",
        };
        return listaErrores[errores] ?? defecto;
    }
    const sendData = (values) => {
        const { email } = values;
        sendPasswordResetEmail(auth, email)
            .then((response) => {
                console.log(response);
                Alert.alert("Éxito", "Revise su email para cambiar la password");
                navigation.goBack();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                Alert.alert("Error", listadoErr(errorCode))
            });
    }
    return (
        <NativeBaseProvider>
            <ScrollView>
                <Box w={"95%"} mt={8} flex={1} p={1} marginLeft={1}>
                    <HStack mt={5} flex={1} space={2}>
                        <Heading mt="1" color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }} fontWeight="medium" size="lg">
                            Cambiar Contraseña Aqui
                        </Heading>
                        <Avatar
                            source={require("../../../assets/reset-password.png")}
                            size="large"
                            justifyContent="center"

                        >
                        </Avatar>
                    </HStack>
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
                                            fontSize={15}
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
                                    <Button mt="2" background={"rgba(117, 140, 255, 1)"}
                                    onPress={handleSubmit} _disabled={styles.botonDisabled}
                                    leftIcon={<Icon as={Ionicons} name="mail" size="sm" />}>
                                        Enviar Email
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