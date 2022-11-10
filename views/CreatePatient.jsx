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
    Text,
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
// Firebase Auth
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';



const CreatePatient = () => {
    //datepicker
   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
    const handleConfirm = (date) => {
        console.warm(date);
      hideDatePicker();
    };
    
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
                   <Text style={styles.tituloForm}>Ingrese los datos del Paciente</Text>     
                    </Heading>
                    <Formik
                        initialValues={{
                            namePet: '',
                            ownerName: '',
                            ownerEmail: '',
                            fechaAlta: '',
                            sintomas: '',
                        }}
                        onSubmit={values => sendData(values)}
                        validationSchema={yup.object().shape({
                            namePet: yup
                                .string()
                                .required('Nombre mascota requerido.'),
                            ownerName: yup
                                .string()
                                .required('Nombre requerido.'),
                            ownerEmail: yup
                                .string()
                                .email()
                                .required('Email requerido.'),
                            fechaAlta: yup
                                .string()
                                .required('Fecha requerido.'),
                            sintomas: yup
                                .string()
                                .required("Campo Requerido")
                        })}>
                        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                            <View>
                                <VStack space={4} mt="5">
                                    <FormControl isInvalid={'namePet' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>NOMBRE:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Digite el nombre de la Mascota'
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
                                        <FormControl.Label _text={styles.labelInput}>DUEÑO:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Digite el nombre del dueño'
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
                                    <FormControl isInvalid={'ownerEmail' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>CORREO:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} placeholder='Digite el Correo Electronico'
                                            InputLeftElement={<Icon as={<MaterialCommunityIcons name="email" />} size={5} ml="2" color="muted.400" />}
                                            value={values.ownerEmail}
                                            onChangeText={handleChange('ownerEmail')}
                                            onBlur={() => setFieldTouched('ownerEmail')} />
                                        {touched.ownerEmail && errors.ownerEmail &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {errors.ownerEmail}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl isInvalid={'fechaAlta' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>FECHA DE ALTA:</FormControl.Label>
                                            <Input 
                                                _focus={styles.inputSeleccionado} placeholder='Sin fecha'
                                                InputLeftElement={<Icon as={<MaterialCommunityIcons name="calendar" />} size={5} ml="2" color="muted.400" />}
                                                value={values.fechaAlta}
                                                onChangeText={handleChange('fechaAlta')}
                                                onBlur={() => setFieldTouched('fechaAlta')} 
                                                editable={false}
                                            />
                                            <DateTimePickerModal
                                                isVisible={isDatePickerVisible}
                                                mode="date"
                                                onConfirm={handleConfirm}
                                                onCancel={hideDatePicker}
                                               
                                            /> 
                                        {touched.fechaAlta && errors.fechaAlta &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {errors.fechaAlta}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                        <View>
                                            <Button style={{width: 150}} 
                                            colorScheme="indigo" 
                                            onPress={showDatePicker} >
                                                Elegir fecha
                                            </Button>
                                        </View>
                                    <FormControl isInvalid={'sintomas' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>SINTOMAS:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado} 
                                            InputLeftElement={<Icon as={<MaterialCommunityIcons name="clipboard-list-outline" />} size={5} ml="2" color="muted.400" />}
                                            value={values.sintomas}
                                            onChangeText={handleChange('sintomas')}
                                            onBlur={() => setFieldTouched('sintomas')} 
                                            multiline={true} />
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
        color: 'indigo',
        fontSize: 18,
        fontWeight: 'bold'
    }
}

export default CreatePatient