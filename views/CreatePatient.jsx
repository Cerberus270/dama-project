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

// Other Components
import DateTimePicker from '@react-native-community/datetimepicker';


// Firebase Auth
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';

const CreatePatient = () => {
    const sendData = (data) => {
        console.log(data)
    }

    return (
        <NativeBaseProvider>
            <ScrollView>
                <Box w={"95%"} mt={8} flex={1} p={1} marginLeft={1}>
                    <Heading mt="1" color="coolGray.600" _dark={{
                        color: "warmGray.200"
                    }} fontWeight="medium" size="xs">
                        Ingrese los datos de la mascota
                    </Heading>
                    <Formik
                        initialValues={{
                            namePet: '',
                            ownerName: '',
                            fechaAlta: '',
                            sintomas: '',
                        }}
                        onSubmit={values => sendData(values)}
                        validationSchema={yup.object().shape({
                            namePet: yup
                                .string()
                                .required('Email requerido.'),
                            ownerName: yup
                                .string()
                                .required('Contraseña requerida.'),
                            fechaAlta: yup
                                .string()
                                .required('Nombre requerido.'),
                            sintomas: yup
                                .string()
                                .required("Campo Requerido")
                        })}>
                        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                            <View>
                                <VStack space={4} mt="5">
                                    <FormControl isInvalid={'namePet' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Nombre de la Mascota</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Escriba el nombre de la Mascota'
                                            InputLeftElement={<Icon as={<MaterialCommunityIcons name="dog" />} size={5} ml="2" color="muted.400" />}
                                            value={values.namePet}
                                            onChangeText={handleChange('namePet')}
                                            onBlur={() => setFieldTouched('namePet')} />
                                        {touched.namePet && errors.namePet &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {errors.namePet}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl isInvalid={'ownerName' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Nombre del Dueño</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Escriba el nombre del dueño'
                                            InputLeftElement={<Icon as={<MaterialCommunityIcons name="account-cowboy-hat" />} size={5} ml="2" color="muted.400" />}
                                            value={values.ownerName}
                                            onChangeText={handleChange('ownerName')}
                                            onBlur={() => setFieldTouched('ownerName')} />
                                        {touched.ownerName && errors.ownerName &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {errors.ownerName}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl isInvalid={'fechaAlta' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Fecha Cita</FormControl.Label>
                                        
                                        <DateTimePicker value={new Date()} />

                                        {/*<Input _focus={styles.inputSeleccionado} placeholder='Ingrese la fecha de la cita'
                                            InputLeftElement={<Icon as={<MaterialCommunityIcons name="calendar" />} size={5} ml="2" color="muted.400" />}
                                            value={values.fechaAlta}
                                            onChangeText={handleChange('fechaAlta')}
                                    onBlur={() => setFieldTouched('fechaAlta')} />*/}
                                        {touched.fechaAlta && errors.fechaAlta &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {errors.fechaAlta}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl isInvalid={'sintomas' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Sintomas</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Sintomas'
                                            InputLeftElement={<Icon as={<MaterialCommunityIcons name="clipboard-list-outline" />} size={5} ml="2" color="muted.400" />}
                                            value={values.sintomas}
                                            onChangeText={handleChange('sintomas')}
                                            onBlur={() => setFieldTouched('sintomas')} />
                                        {touched.sintomas && errors.sintomas &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {errors.sintomas}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <Button mt="2" colorScheme="indigo" onPress={handleSubmit} _disabled={styles.botonDisabled}>
                                        Guardar
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

export default CreatePatient