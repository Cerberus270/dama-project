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
    Radio,
    resetForm,
    Pressable
} from "native-base"
// Validation Imports
import * as yup from 'yup';
import {Formik, getIn} from 'formik';
import {MaterialCommunityIcons} from '@expo/vector-icons';
// Other Components
// Firebase Auth and Firestore
import {auth, db} from '../../../config/firebase'
import {addDoc, collection} from "firebase/firestore";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from "react-native-vector-icons/Ionicons";

const CreateRecetas = ({navigation}) => {
    //Date Picker
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [text, setText] = useState('');
    const [proximaCita, setProximaCita] = useState(new Date());

    const formularioValidacion = yup.object().shape({
             nombreProducto: yup
            .string()
            .min(2, 'Minimo 2 caracteres')
            .required('Nombre de producto requerido.'),
            marcaProducto: yup
            .string()
            .min(2, 'Minimo 2 caracteres')
            .required('Marca de producto mascota requerido.'),
            tipo: yup
            .string()
            .required('Elija tipo de Atención brindada'),
            indicaciones: yup
            .string()
            .required('Brinde indicaciones del Producto'),
    });

    const valoresIniciales = {
        nombreProducto: '',
        marcaProducto: '',
        tipo: '',
        indicaciones: '',
    }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        setProximaCita(tempDate);
        setText(fDate);

        console.log(fDate)
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
            data.fechaReceta = new Date();
            addDoc(collection(db, "atenciones/receta"), data)
                .then((ocRef) => {
                    Alert.alert("Exito", "Se agregó Receta correctamente", [
                        {
                            text: "Aceptar",
                        }
                    ]);
                    if (Platform.OS === "web") {
                        alert("Se agregó Receta correctamente");
                        navigation.navigate('CreateAtenciones');
                    }
                })
                .catch((error) => {
                    Alert.alert("Error", "Ocurrio un error al agregar Receta");
                    if (Platform.OS === "web") {
                        alert("Ocurrio un error al agregar Receta");
                    }
                });

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
                        <Text style={styles.tituloForm}>Receta Médica</Text>
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
                        {({values, 
                        handleChange, 
                        errors, 
                        setFieldTouched,
                        touched,
                        isValid,
                        handleSubmit
                    }) => (
                            <View>
                                <VStack space={4} mt="5">
                                    <FormControl isInvalid={'nombreProducto' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Producto</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Digite nombre de producto'
                                               InputLeftElement={<Icon as={<MaterialCommunityIcons name="dog"/>}
                                                                       size={5} ml="2" color="muted.400"/>}
                                               value={values.nombreProducto}
                                               onChangeText={handleChange('nombreProducto')}
                                               onBlur={() => setFieldTouched('nombreProducto')}/>
                                        {touched.nombreProducto && errors.nombreProducto &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.nombreProducto}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl isInvalid={'marcaProducto' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Marca:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Digite marca de producto'
                                               InputLeftElement={<Icon as={<MaterialCommunityIcons name="dog"/>}
                                                                       size={5} ml="2" color="muted.400"/>}
                                               value={values.marcaProducto}
                                               onChangeText={handleChange('marcaProducto')}
                                               onBlur={() => setFieldTouched('marcaProducto')}/>
                                        {touched.marcaProducto && errors.marcaProducto &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.marcaProducto}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                     <FormControl isInvalid={'tipo' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Tipo de Producto:</FormControl.Label>
                                        <Radio.Group
                                            name="tipo"
                                            accessibilityLabel="Tipo Atencion"
                                            value={values.tipo}
                                            onChange={handleChange('tipo')}>
                                            <Radio value="Desparasitantes" my={1}>
                                                Desparasitantes
                                            </Radio>
                                            <Radio value="Vacunas" my={1}>
                                                Vacunas
                                            </Radio>
                                            <Radio value="Suplementos" my={1}>
                                                Suplementos
                                            </Radio>
                                            <Radio value="Antibióticos" my={1}>
                                                Antibióticos
                                            </Radio>
                                            <Radio value="Antiinflamatorios" my={1}>
                                                Antiinflamatorios
                                            </Radio>
                                            <Radio value="Estética" my={1}>
                                                Estética
                                            </Radio>
                                        </Radio.Group>
                                        {touched.tipo && errors.tipo &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.tipo}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                             
                                    <FormControl isInvalid={'indicaciones' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Indicaciones</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               height={85}
                                               placeholder='sin datos'
                                               InputLeftElement={<Icon as={<MaterialCommunityIcons name="dog"/>}
                                                                       size={5} ml="2" color="muted.400"/>}
                                               value={values.indicaciones}
                                               onChangeText={handleChange('indicaciones')}
                                               onBlur={() => setFieldTouched('indicaciones')}/>
                                        {touched.indicaciones && errors.indicaciones &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.indicaciones}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>

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

export default CreateRecetas