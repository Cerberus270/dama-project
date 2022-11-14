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
    Radio,
    Pressable
} from "native-base"
// Validation Imports
import * as yup from 'yup';
import {Formik, getIn} from 'formik';
import {MaterialCommunityIcons} from '@expo/vector-icons';
// Other Components
//import DateTimePickerModal from "react-native-modal-datetime-picker";
// Firebase Auth and Firestore
import {auth, db} from '../../../config/firebase'
import {addDoc, collection} from "firebase/firestore";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


const CreatePaciente = () => {
    //Date Picker
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [text, setText] = useState('');
    const [fecNac, setFecNac] = useState(new Date());

    const regexPhone = /^[0-9]{4}-[0-9]{4}$/;

    const formularioValidacion = yup.object().shape({
        nombre: yup
            .string()
            .min(2, 'Minimo 2 caracteres')
            .required('Nombre mascota requerido.'),
        tipo: yup
            .string()
            .min(4, 'Minimo 4 caracteres')
            .required('Tipo de Paciente requerido'),
        raza: yup
            .string()
            .min(4, 'Minimo 4 caracteres')
            .required('Raza requerida'),
        sexo: yup
            .string()
            .required('Sexo paciente requerido'),
        peso: yup
            .number()
            .min(0, 'Ingrese un peso mayor a 0 lb')
            .required('Peso del paciente requerido'),
        propietario: yup.object().shape({
            nombre: yup
                .string()
                .min(4, 'Minimo 4 caracteres')
                .required('Nombre requerido.'),
            telefono: yup
                .string()
                .required('Telefono requerido.')
                .matches(regexPhone, 'Formato XXXX-XXXX'),
            direccion: yup
                .string()
                .min(6, 'Minimo 6 caracteres')
                .required('Direccion requerida')
        })
    });

    const valoresIniciales = {
        nombre: '',
        tipo: '',
        raza: '',
        sexo: '',
        peso: '',
        propietario: {
            nombre: '',
            telefono: '',
            direccion: '',
        }
    }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        setFecNac(tempDate);
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
        } else {
            data.fechaNacimiento = fecNac;
            data.fechaRegistro = new Date();
            data.veterinario = auth.currentUser.uid;
            addDoc(collection(db, "patients"), data)
                .then((ocRef) => {
                    Alert.alert("Exito", "Se registro el paciente correctamente", [
                        {
                            text: "Aceptar",
                        }
                    ]);
                    if (Platform.OS === "web") {
                        alert("Se registro el paciente correctamente");
                    }
                })
                .catch((error) => {
                    Alert.alert("Error", "Ocurrio un error al registrar el paciente");
                    if (Platform.OS === "web") {
                        alert("Ocurrio un error al registrar el paciente");
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
                        <Text style={styles.tituloForm}>Ingrese los datos del Paciente</Text>
                    </Heading>
                    <Formik
                        initialValues={valoresIniciales}
                        onSubmit={(values, {resetForm}) => {
                            sendData(values);
                            resetForm({values: valoresIniciales});
                            setText('');
                        }
                        }
                        validationSchema={formularioValidacion}>
                        {({values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit}) => (
                            <View>
                                <VStack space={4} mt="5">
                                    <FormControl isInvalid={'nombre' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Nombre
                                            Paciente:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Digite el nombre del paciente'
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
                                        <FormControl.Label _text={styles.labelInput}>Tipo Paciente:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Digite el tipo del paciente'
                                               InputLeftElement={<Icon as={<MaterialCommunityIcons name="cat"/>}
                                                                       size={5} ml="2" color="muted.400"/>}
                                               value={values.tipo}
                                               onChangeText={handleChange('tipo')}
                                               onBlur={() => setFieldTouched('tipo')}/>
                                        {touched.tipo && errors.tipo &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.tipo}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl isInvalid={'raza' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Raza Paciente:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Digite la raza del paciente'
                                               InputLeftElement={<Icon as={<MaterialCommunityIcons name="dog-side"/>}
                                                                       size={5} ml="2" color="muted.400"/>}
                                               value={values.raza}
                                               onChangeText={handleChange('raza')}
                                               onBlur={() => setFieldTouched('raza')}/>
                                        {touched.raza && errors.raza &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.raza}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>

                                    <FormControl isInvalid={'sexo' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Sexo Paciente:</FormControl.Label>
                                        <Radio.Group
                                            name="rSexo"
                                            accessibilityLabel="Sexo paciente"
                                            value={values.sexo}
                                            onChange={handleChange('sexo')}>
                                            <Radio value="Macho" my={1}>
                                                Macho
                                            </Radio>
                                            <Radio value="Hembra" my={1}>
                                                Hembra
                                            </Radio>
                                        </Radio.Group>
                                        {touched.sexo && errors.sexo &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.sexo}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>

                                    <FormControl isInvalid={'peso' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Peso Paciente:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Digite el peso del Paciente'
                                               InputLeftElement={<Icon
                                                   as={<MaterialCommunityIcons name="weight-pound"/>} size={5} ml="2"
                                                   color="muted.400"/>}
                                               value={values.peso}
                                               keyboardType={"decimal-pad"}
                                               onChangeText={handleChange('peso')}
                                               onBlur={() => setFieldTouched('peso')}/>
                                        {touched.peso && errors.peso &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.peso}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl onTouchStart={() => showMode('date')}>
                                        <FormControl.Label _text={styles.labelInput}>Fecha de Nacimiento:</FormControl.Label>
                                        <Input
                                            _focus={styles.inputSeleccionado} placeholder='Sin fecha'
                                            InputLeftElement={<Icon as={<MaterialCommunityIcons name="calendar"/>}
                                                                    size={5} ml="2" color="muted.400"/>}
                                            value={text}
                                            isReadOnly={true}
                                        />

                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                            <Text>Ingrese una fecha Valida</Text>
                                        </FormControl.ErrorMessage>
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

                                    <FormControl isInvalid={getIn(errors, 'propietario.nombre')}>
                                        <FormControl.Label _text={styles.labelInput}>Nombre
                                            Propietario:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Digite el nombre del propietario'
                                               InputLeftElement={<Icon
                                                   as={<MaterialCommunityIcons name="account-cowboy-hat"/>} size={5}
                                                   ml="2" color="muted.400"/>}
                                               value={values.propietario.nombre}
                                               onChangeText={handleChange('propietario.nombre')}
                                               onBlur={() => setFieldTouched('propietario.nombre')}/>
                                        {getIn(touched, 'propietario.nombre') && getIn(errors, 'propietario.nombre') &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {getIn(errors, 'propietario.nombre')}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl isInvalid={getIn(errors, 'propietario.telefono')}>
                                        <FormControl.Label _text={styles.labelInput}>Telefono
                                            Propietario:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Digite Telefono del Propietario'
                                               InputLeftElement={<Icon as={<MaterialCommunityIcons name="phone"/>}
                                                                       size={5} ml="2" color="muted.400"/>}
                                               value={values.propietario.telefono}
                                               keyboardType={"number-pad"}
                                               onChangeText={handleChange('propietario.telefono')}
                                               onBlur={() => setFieldTouched('propietario.telefono')}/>
                                        {getIn(touched, 'propietario.telefono') && getIn(errors, 'propietario.telefono') &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {getIn(errors, 'propietario.telefono')}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <FormControl isInvalid={getIn(errors, 'propietario.direccion')}>
                                        <FormControl.Label _text={styles.labelInput}>Direccion
                                            Propietario:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Digite la direccion del Propietario'
                                               InputLeftElement={<Icon
                                                   as={<MaterialCommunityIcons name="home-map-marker"/>} size={5} ml="2"
                                                   color="muted.400"/>}
                                               value={values.propietario.direccion}
                                               onChangeText={handleChange('propietario.direccion')}
                                               onBlur={() => setFieldTouched('propietario.direccion')}/>
                                        {getIn(touched, 'propietario.direccion') && getIn(errors, 'propietario.direccion') &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {getIn(errors, 'propietario.direccion')}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                    <Button mt="2" mb="2" colorScheme="indigo" variant="subtle" onPress={handleSubmit}
                                            _disabled={styles.botonDisabled}
                                            leftIcon={<Icon as={MaterialCommunityIcons} name="content-save"
                                                            size="sm"/>}>
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

export default CreatePaciente