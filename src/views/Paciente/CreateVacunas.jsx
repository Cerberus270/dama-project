import React, { useEffect, useState } from "react";
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

const CreateVacunas = ({ navigation, route }) => {
  const { id } = route.params;
  console.log(id);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [text, setText] = useState("");
  const [proxD, setProxD] = useState(new Date());

  const formularioValidacion = yup.object().shape({
    nombre: yup
      .string()
      .min(2, "Minimo 2 caracteres")
      .required("Nombre mascota requerido."),
    marca: yup
      .string()
      .min(2, "Minimo 2 caracteres")
      .required("Marca requerida"),
    tipo: yup.string().required("Tipo de vacuna requerida"),
    dosis: yup.string().required("Dosis requerida"),
    peso: yup
      .number()
      .min(0, "Ingrese un peso mayor a 0 lb")
      .required("Peso del paciente requerido"),
  });

  const valoresIniciales = {
    nombre: "",
    marca: "",
    tipo: "",
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
      data.proximaDosis = proxD;
      data.fecha = new Date();
      addDoc(collection(db, "vacunas"), data)
        .then((ocRef) => {
          Alert.alert("Exito", "Se registro vacuna correctamente", [
            {
              text: "Aceptar",
            },
          ]);
          if (Platform.OS === "web") {
            alert("Se registro vacuna correctamente");
          }
        })
        .catch((error) => {
          Alert.alert("Error", "Ocurrio un error al registrar vacuna");
          if (Platform.OS === "web") {
            alert("Ocurrio un error al registrar vacuna");
          }
        });
      return true;
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <NativeBaseProvider>
      <ScrollView>
        <Box w={"95%"} mt={8} flex={1} p={1} marginLeft={1}>
          <Heading
            mt="1"
            color="coolGray.600"
            _dark={{
              color: "warmGray.200",
            }}
            fontWeight="medium"
            size="xs"
          >
            <Text style={styles.tituloForm}>Ingrese Datos de Nueva Vacuna</Text>
          </Heading>
          <Formik
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
                      placeholder="Digite Nombre de Vacuna"
                      InputLeftElement={
                        <Icon
                          as={<MaterialCommunityIcons name="needle" />}
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
                      placeholder="Digite Marca de Vacuna"
                      InputLeftElement={
                        <Icon
                          as={<MaterialCommunityIcons name="dog-side" />}
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
                  <FormControl isInvalid={"tipo" in errors}>
                    <FormControl.Label _text={styles.labelInput}>
                      Tipo:
                    </FormControl.Label>
                    <Select
                      minWidth="200"
                      accessibilityLabel="Seleccione Tipo de Vacuna"
                      placeholder="Seleccione tipo de vacuna"
                      onValueChange={handleChange("tipo")}
                      selectedValue={values.tipo}
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={5} />,
                      }}
                      mt="1"
                    >
                      <Select.Item
                        label="Distemper (Moquillo)"
                        value="Distemper"
                      />
                      <Select.Item label="Rabia" value="Rabia" />
                      <Select.Item label="Parvovirus" value="Parvovirus" />
                      <Select.Item
                        label="Leptospirosis"
                        value="Leptospirosis"
                      />
                      <Select.Item
                        label="Hepatitis Infecciosa Canina"
                        value="Hepatitis"
                      />
                    </Select>
                    {touched.tipo && errors.tipo && (
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.tipo}
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={"raza" in errors}>
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
                      value={values.raza}
                      onChangeText={handleChange("raza")}
                      onBlur={() => setFieldTouched("raza")}
                    />
                    {touched.raza && errors.raza && (
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.raza}
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
                  <HStack space={2} justifyContent="center" paddingTop={5}>
                    <Ionicons.Button
                      backgroundColor={"rgba(117, 140, 255, 1)"}
                      size={10}
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
                      size={10}
                      onPress={() => {
                        resetForm();
                        setText("");
                      }}
                      style={{
                        alignSelf: "stretch",
                        justifyContent: "center",
                      }}
                      name="backspace"
                      _disabled={styles.botonDisabled}
                    >
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

export default CreateVacunas;
