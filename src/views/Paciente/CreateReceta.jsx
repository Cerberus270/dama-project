import React, {useEffect, useRef, useState} from 'react'
import {Alert} from 'react-native';
// Components Imports
import {
    NativeBaseProvider,
    ScrollView,
    Box,
    Heading,
    VStack,
    HStack,
    FormControl,
    Input,
    Text,
    Button,
    View,
    WarningOutlineIcon,
    Icon,
    Radio,
    Select,
    CheckIcon,
    Pressable,
} from "native-base";
import { useFocusEffect } from "@react-navigation/native";
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
import Ionicons from "react-native-vector-icons/Ionicons";

const CreateReceta = ({navigation}) => {

    const [text, setText] = useState('');
    const [uploading, setUploading] = useState(false);

    const form = useRef();

    const formularioValidacion = yup.object().shape({
             nombreProducto: yup
            .string()
            .min(2, 'Minimo 2 caracteres')
            .required('Nombre de producto requerido.'),
            marcaProducto: yup
            .string()
            .min(2, 'Minimo 2 caracteres')
            .required('Marca de producto requerida.'),
            tipo: yup
            .string()
            .required('Elija tipo de producto'),
            indicaciones: yup
            .string()
            .min(6, 'Minimo 6 caracteres')
            .required('Brinde indicaciones del Producto'),
    });

    const valoresIniciales = {
        nombreProducto: '',
        marcaProducto: '',
        tipo: '',
        indicaciones: '',
    }

    const sendData = (data) => {
        if (text === '') {
            if (Platform.OS === "web") {
                alert("Debe Ingresar un nombre de producto");
            } else {
                Alert.alert("Deber Ingresar un nombre de producto")
            }
            return false;
        } else {
            setUploading(true);
            addDoc(collection(db, "receta"), data)
                .then((ocRef) => {
                    setUploading(true);
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
                    setUploading(false);
                    Alert.alert("Error", "Ocurrio un error al agregar Receta");
                    if (Platform.OS === "web") {
                        alert("Ocurrio un error al agregar Receta");
                    }
                });
            return true;
        }
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
        form.reset;
      };

      useFocusEffect(
        React.useCallback(() => {
          return () => {
            form.current?.resetForm();
            setText("")
          };
        }, [])
      );

    return (
        <NativeBaseProvider>
            <ScrollView>
                <Box style={{ marginHorizontal: 5 }} mt={2} flex={1} p={1}>
                    <Heading
                        mt={5}
                        size="lg"
                        color="coolGray.800"
                        _dark={{
                        color: "warmGray.50",
                        }}
                        fontWeight="bold"
                        alignSelf="center"
                    >
                        Registro de receta
                    </Heading>
                    <Formik
                        innerRef={form}
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
                                    <FormControl isInvalid={'nombreProducto' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Producto</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               placeholder='Digite nombre de producto'
                                               InputLeftElement={<Icon as={<MaterialCommunityIcons name="pill"/>}
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
                                               InputLeftElement={<Icon as={<MaterialCommunityIcons name="registered-trademark"/>}
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
                                        <Select minWidth="200" accessibilityLabel="Tipo de Producto Recetado" placeholder="Seleccione tipo de producto recetado" onValueChange={handleChange('tipo')}
                                            selectedValue={values.tipo}
                                            _selectedItem={{
                                                bg: "teal.600",
                                                endIcon: <CheckIcon size={5} />
                                            }} mt="1">
                                            <Select.Item label="Desparasitantes" value="Desparasitantes" />
                                            <Select.Item label="Vacunas" value="Vacunas" />
                                            <Select.Item label="Suplementos" value="Suplementos" />
                                            <Select.Item label="Antibióticos" value="Antibióticos" />
                                            <Select.Item label="Antiinflamatorios" value="Antiinflamatorios" />
                                            <Select.Item label="Estética" value="Estética" />
                                        </Select>
                                        {touched.tipo && errors.tipo &&
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                                {errors.tipo}
                                            </FormControl.ErrorMessage>
                                        }
                                    </FormControl>
                                             
                                    <FormControl isInvalid={'indicaciones' in errors}>
                                        <FormControl.Label _text={styles.labelInput}>Indicaciones:</FormControl.Label>
                                        <Input _focus={styles.inputSeleccionado}
                                               height={85}
                                               placeholder='Escriba aquí'
                                               InputLeftElement={<Icon as={<MaterialCommunityIcons name="file-edit-outline"/>}
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

                                    <HStack mb={5} space={2} justifyContent="center">
                                        <Ionicons.Button
                                        backgroundColor={"rgba(117, 140, 255, 1)"}
                                        size={22}
                                        onPress={handleSubmit}
                                        style={{
                                            alignSelf: "stretch",
                                            justifyContent: "center",
                                        }}
                                        name="save"
                                        _disabled={styles.botonDisabled}
                                        >
                                        Guardar
                                        </Ionicons.Button>
                                        <Ionicons.Button
                                        backgroundColor={"rgba(117, 140, 255, 1)"}
                                        size={22}
                                        onPress={() => {
                                            resetForm();
                                            setText("");
                                        }}
                                        style={{
                                            alignSelf: "stretch",
                                            justifyContent: "center",
                                        }}
                                        name="refresh-outline"
                                        _disabled={styles.botonDisabled}
                                        >
                                        Reestablecer
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

export default CreateReceta