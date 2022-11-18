import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
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
import * as yup from "yup";
import { Formik, getIn } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// Other Components
//import DateTimePickerModal from "react-native-modal-datetime-picker";
// Firebase Auth and Firestore
import { auth, db } from "../../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";

const CreateDesparasitacion = () => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState("date");
    const [text, setText] = useState("");
    const [proxD, setProxD] = useState(new Date());
    const [uploading, setUploading] = useState(false);
  
    const form = useRef();
  
    const formularioValidacion = yup.object().shape({
      nombre: yup
        .string()
        .min(2, "Minimo 2 caracteres")
        .required("Nombre mascota requerido."),
      marca: yup
        .string()
        .min(2, "Minimo 2 caracteres")
        .required("Marca requerida"),
      dosis: yup.string().required("Dosis requerida"),
      peso: yup
        .number()
        .min(0, "Ingrese un peso mayor a 0 lb")
        .required("Peso del paciente requerido"),
    });
  
    const valoresIniciales = {
      nombre: "",
      marca: "",
      dosis: "",
      peso: "",
    };
  
    const onChangeDate = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setDate(currentDate);
  
      if (event.type == "set") {
        let tempDate = new Date(currentDate);
        let fDate =
          tempDate.getDate() +
          "/" +
          (tempDate.getMonth() + 1) +
          "/" +
          tempDate.getFullYear();
        setProxD(tempDate);
        setText(fDate);
        console.log(fDate);
      }
    };
  
    const sendData = (data) => {
      if (text === "") {
        if (Platform.OS === "web") {
          alert("Debe Ingresar una Fecha Valida");
        } else {
          Alert.alert("Deber Ingresar una Fecha Valida");
        }
        return false;
      } else {
        setUploading(true);
        data.proximaDosis = proxD;
        data.fecha = new Date();
        addDoc(collection(db, "patients", id, "desparasitacion"), data)
          .then((ocRef) => {
            setUploading(false);
            Alert.alert("Exito", "Se registró desparasitacion correctamente", [
              {
                text: "Aceptar",
              },
            ]);
            if (Platform.OS === "web") {
              alert("Se registró desparasitacion correctamente");
            }
          })
          .catch((error) => {
            setUploading(false);
            Alert.alert("Error", "Ocurrio un error al registrar desparasitacion");
            if (Platform.OS === "web") {
              alert("Ocurrio un error al registrar desparasitacion");
            }
          });
        return true;
      }
    };
  
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
      form.reset;
    };
  
    useFocusEffect(
      React.useCallback(() => {
        return () => {
          form.current?.resetForm();
          setShow(false)
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
              Registro de Desparasitación
            </Heading>
            <Formik
              innerRef={form}
              initialValues={valoresIniciales}
              onSubmit={(values, { resetForm }) => {
                if (sendData(values)) {
                  resetForm({ values: valoresIniciales });
                  setText("");
                }
              }}
              validationSchema={formularioValidacion}
            >
              {({
                values,
                handleChange,
                errors,
                setFieldTouched,
                touched,
                isValid,
                handleSubmit,
                resetForm,
              }) => (
                <View>
                  <VStack space={4} mt="5">
                    <FormControl isInvalid={"nombre" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Nombre:
                      </FormControl.Label>
                      <Input
                        _focus={styles.inputSeleccionado}
                        placeholder="Digite nombre de Desparasitante"
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="pill" />}
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                        value={values.nombre}
                        onChangeText={handleChange("nombre")}
                        onBlur={() => setFieldTouched("nombre")}
                      />
                      {touched.nombre && errors.nombre && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.nombre}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={"marca" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Marca:
                      </FormControl.Label>
                      <Input
                        _focus={styles.inputSeleccionado}
                        placeholder="Digite marca de Desparasitante"
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="registered-trademark" />}
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                        value={values.marca}
                        onChangeText={handleChange("marca")}
                        onBlur={() => setFieldTouched("marca")}
                      />
                      {touched.marca && errors.marca && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.marca}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={"dosis" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Dosis:
                      </FormControl.Label>
                      <Input
                        _focus={styles.inputSeleccionado}
                        placeholder="Digite Dosis de Vacuna"
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="eyedropper" />}
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                        value={values.dosis}
                        onChangeText={handleChange("dosis")}
                        onBlur={() => setFieldTouched("dosis")}
                      />
                      {touched.dosis && errors.dosis && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.dosis}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={"peso" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Peso Paciente:
                      </FormControl.Label>
                      <Input
                        _focus={styles.inputSeleccionado}
                        placeholder="Digite el peso del Paciente"
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="weight-pound" />}
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                        value={values.peso}
                        keyboardType={"decimal-pad"}
                        onChangeText={handleChange("peso")}
                        onBlur={() => setFieldTouched("peso")}
                      />
                      {touched.peso && errors.peso && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.peso}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl onTouchStart={() => showMode("date")}>
                      <FormControl.Label _text={styles.labelInput}>
                        Próxima dosis:
                      </FormControl.Label>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={
                          <Icon
                            as={MaterialCommunityIcons}
                            name="calendar"
                            size="sm"
                          />
                        }
                        onLongPress={() => showMode("date")}
                      >
                        {text.length > 1 ? text : "Seleccione una Fecha"}
                      </Button>
                    </FormControl>
                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeDate}
                      />
                    )}
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
    );
  };
  
  const styles = {
    inputSeleccionado: {
      bg: "coolGray.200:alpha.100",
    },
    botonDisabled: {
      backgroundColor: "#00aeef",
    },
    labelInput: {
      color: "black",
      fontSize: "sm",
      fontWeight: "bold",
    },
    tituloForm: {
      color: "indigo",
      fontSize: 18,
      fontWeight: "bold",
    },
  };
export default CreateDesparasitacion