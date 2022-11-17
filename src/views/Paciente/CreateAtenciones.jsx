import React, {useEffect, useState} from 'react'
import {Alert} from 'react-native';
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
    HStack,
    Select,
    CheckIcon,
    Pressable
} from "native-base"
// Validation Imports
import * as yup from 'yup';
import {Formik} from 'formik';
import {MaterialCommunityIcons} from '@expo/vector-icons';
// Other Components
// Firebase Auth and Firestore
import {auth, db} from '../../../config/firebase'
import {addDoc, collection} from "firebase/firestore";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from "react-native-vector-icons/Ionicons";

const CreateAtenciones = ({navigation}) => {
    //Date Picker
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [text, setText] = useState('');
    const [proximaCita, setProximaCita] = useState(new Date());

    const formularioValidacion = yup.object().shape({
        nombre: yup
            .string()
            .min(2, 'Minimo 2 caracteres')
            .required('Nombre mascota requerido.'),
            tipo: yup
            .string()
            .required('Elija tipo Atención brindada'),
            descripcion: yup
            .string()
            .min(4, 'Minimo 4 caracteres')
            .required('Descripción requerida'),
    });

    const valoresIniciales = {
        nombre: '',
        tipo: '',
        descripcion: '',
    }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        if (event.type == "set") {
            let tempDate = new Date(currentDate);
            let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
            setProximaCita(tempDate);
            setText(fDate);
            console.log(fDate);
        }
    }

    const sendData = (data) => {
        if (text === '') {
            if (Platform.OS === "web") {
                alert("Debe Ingresar una Fecha Valida");
            } else {
                Alert.alert("Deber Ingresar una Fecha Valida")
            }
            return false;
        } else {
            data.fecha = new Date();
            data.proximaCita = proximaCita;
            addDoc(collection(db, "atenciones"), data)
                .then((ocRef) => {
                    Alert.alert("Exito", "Se agregó atención correctamente", [
                        {
                            text: "Aceptar",
                        }
                    ]);
                    if (Platform.OS === "web") {
                        alert("Se agregó atención correctamente");
                    }
                })
                .catch((error) => {
                    Alert.alert("Error", "Ocurrio un error al agregar atención");
                    if (Platform.OS === "web") {
                        alert("Ocurrio un error al agregar atención");
                    }
                });
             return true;
        }
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode)
    }

    return (
        <NativeBaseProvider>
            <ScrollView>
                <Box w={"95%"} mt={8} flex={1} p={1} marginLeft={1}>
                    <Heading mt="1" color="coolGray.600" _dark={{
                        color: "warmGray.200"
                    }} fontWeight="medium" size="xs">
                        <Text style={styles.tituloForm}>Ingrese Nueva Atención</Text>
                    </Heading>
                    <Formik
                        initialValues={valoresIniciales}
                        onSubmit={(values, {resetForm}) => {
                          if(sendData(values))  {
                            resetForm({values: valoresIniciales});
                            setText('');
                          }
                        }
                        }
                        validationSchema={formularioValidacion}>
                        {({
                            values, 
                            handleChange, 
                            errors, 
                            setFieldTouched,
                            touched,
                            isValid,
                            handleSubmit,
                            resetForm
                    }) => (
                            <View>
                                <VStack space={4} mt="5">
                                    <FormControl isInvalid={'nombre' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Mascota:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Escriba nombre de mascota'
                                               InputLeftElement={<Icon as={<MaterialCommunityIcons name="dog"/>}
                                                                       size={5} ml="2" color="muted.400"/>}
                                               value={values.nombre}
                                               onChangeText={handleChange('nombre')}
                                               onBlur={() => setFieldTouched('nombre')}/>
                                        {touched.nombre && errors.nombre &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.nombre}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>

                                     <FormControl isInvalid={'tipo' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Tipo de Atención:</FormControl.Label>
                                        <Select minWidth="200" accessibilityLabel="Seleccione tipo de Paciente" placeholder="Seleccione tipo de Paciente" onValueChange={handleChange('tipo')}
                                            selectedValue={values.tipo}
                                            _selectedItem={{
                                                bg: "teal.600",
                                                endIcon: <CheckIcon size={5} />
                                            }} mt="1">
                                            <Select.Item label="Consulta" value="Consulta" />
                                            <Select.Item label="Emergencia" value="Emergencia" />
                                            <Select.Item label="Grooming" value="Grooming" />
                                        </Select>
                                        
                                        {touched.tipo && errors.tipo &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.tipo}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                          
                                    <FormControl onTouchStart={() => showMode('date')}>
                                        <FormControl.Label _text={styles.labelInput}>Próxima Cita:</FormControl.Label>
                                        <Button size="sm" variant="outline" leftIcon={<Icon as={MaterialCommunityIcons} name="calendar" size="sm" />} onLongPress={() => showMode('date')}>
                                            {text.length > 1 ? text : 'Seleccione una Fecha' }
                                        </Button>
                                       
                                    </FormControl>
                                    {show && (
                                        <DateTimePicker
                                            testID='dateTimePicker'
                                            value={date}
                                            mode={mode}
                                            is24Hour={true}
                                            display='default'
                                            onChange={onChangeDate}
                                        />
                                    )}
                                        
                                    <FormControl isInvalid={'descripcion' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Descripcion:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Escriba aquí'
                                               InputLeftElement={<Icon as={<MaterialCommunityIcons name="file-edit-outline"/>}
                                                                       size={5} ml="2" color="muted.400"/>}
                                               value={values.descripcion}
                                               onChangeText={handleChange('descripcion')}
                                               onBlur={() => setFieldTouched('descripcion')}/>
                                        {touched.descripcion && errors.descripcion &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.descripcion}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>

                                    <Button mt="2" mb="2" colorScheme="indigo" variant="subtle"
                                            onPress={() => {
                                                navigation.navigate('CreateReceta');
                                            }}
                                            _disabled={styles.botonDisabled}
                                            leftIcon={<Icon as={MaterialCommunityIcons} name="content-save"
                                                            size="sm"/>}>
                                        Crear Receta
                                    </Button>

                                    <HStack space={2} justifyContent="center">
                                        <Ionicons.Button
                                            backgroundColor={"rgba(117, 140, 255, 1)"}
                                            size={10}
                                            onPress={handleSubmit}
                                            style={{
                                                alignSelf: "stretch",
                                                justifyContent: "center",
                                            }}
                                            name="save"
                                            _disabled={styles.botonDisabled}>
                                            Guardar
                                        </Ionicons.Button>
                                        <Ionicons.Button
                                            backgroundColor={"rgba(117, 140, 255, 1)"}
                                            size={20}
                                            onPress={() => {
                                                resetForm();
                                                setText('');
                                            }
                                            }
                                            style={{
                                                alignSelf: "stretch",
                                                justifyContent: "center",
                                            }}
                                            name="backspace"
                                            _disabled={styles.botonDisabled}>
                                            Reset
                                        </Ionicons.Button>
                                    </HStack>
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

export default CreateAtenciones