import { View, Alert, KeyboardAvoidingView } from "react-native";
import React, { Component, useRef } from "react";
import * as yup from "yup";
import {
  NativeBaseProvider,
  ScrollView,
  Box,
  Heading,
  Text,
  Input,
  FormControl,
  WarningOutlineIcon,
  Icon,
  VStack,
  HStack,
  Select,
  CheckIcon,
  Button,
} from "native-base";
import { Avatar } from "react-native-elements";
import { useState } from "react";
import { auth, db } from "../../../config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Formik, getIn } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Radio } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useHeaderHeight } from "@react-navigation/elements";

export default function UpdateVacuna({ navigation, route }) {
  const { idPaciente } = route.params;
  const { id } = route.params.vacuna;
  const [vacuna, setVacuna] = useState(null);
  const [loading, setLoading] = useState(false);

  //Date Picker Actual
  const [dateActual, setDateActual] = useState(new Date());
  const [showActual, setShowActual] = useState(false);
  const [modeActual, setModeActual] = useState("date");
  const [textActual, setTextActual] = useState("");
  const [fecActual, setFecActual] = useState(new Date());

  // Date picker proxima
  const [dateProxima, setDateProxima] = useState(new Date());
  const [showProxima, setShowProxima] = useState(false);
  const [modeProxima, setModeProxima] = useState("date");
  const [textProxima, setTextProxima] = useState("");
  const [fecProxima, setFecProxima] = useState(new Date());

  const headerHeight = useHeaderHeight();

  const formularioValidacion = yup.object().shape({
    nombre: yup
      .string()
      .min(2, "Minimo 2 caracteres")
      .required("Nombre vacuna requerido."),
    marca: yup
      .string()
      .min(2, "Minimo 2 caracteres")
      .required("Marca requerida"),
    tipo: yup.string().required("Tipo de vacuna requerida"),
    dosis: yup.number().required("Dosis requerida"),
    peso: yup
      .number()
      .min(0, "Ingrese un peso mayor a 0 lb")
      .required("Peso del paciente requerido"),
  });

  const form = useRef();

  const checkDates = (date1, date2) => {
    let control;
    date1 > date2 ? (control = true) : (control = false);
    return control;
  };

  const timestampToDate = (valorTimestamp) => {
    return new Date(valorTimestamp * 1000).toLocaleDateString("es");
  };

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const unsuscribe = onSnapshot(
        doc(db, "patients", idPaciente, "vacunas", id),
        (doc) => {
          if (doc.exists()) {
            console.log(doc.data());
            setVacuna(doc.data());
            setTextActual(timestampToDate(doc.data().fecha.seconds));
            setDateActual(new Date(doc.data().fecha.seconds * 1000));
            //Proxima Dosis
            setTextProxima(timestampToDate(doc.data().proximaDosis.seconds));
            setDateProxima(new Date(doc.data().proximaDosis.seconds * 1000));
            setLoading(false);
          } else {
            setVacuna(null);
            Alert.alert(
              "Error",
              "No hemos podido localizar esta vacuna, contacte con soporte",
              [
                {
                  text: "Aceptar",
                  onPress: async () => {
                    navigation.goBack();
                  },
                },
              ]
            );
          }
        }
      );

      return () => {
        unsuscribe();
        setVacuna(null);
        setLoading(false);
        setDateActual(null);
        setDateProxima(null);
      };
    }, [])
  );

  const onChangeDateActual = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowActual(Platform.OS === "ios");
    setDateActual(currentDate);

    if (event.type === "set") {
      let tempDate = new Date(currentDate);
      let fDate =
        tempDate.getDate() +
        "/" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
      setFecActual(tempDate);
      setTextActual(fDate);
      console.log("Fecha Actual", fDate);
    }
  };

  const showModeActual = (currentMode) => {
    setShowActual(true);
    setModeActual(currentMode);
    form.reset;
  };

  const onChangeDateProxima = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowProxima(Platform.OS === "ios");
    setDateProxima(currentDate);

    if (event.type === "set") {
      let tempDate = new Date(currentDate);
      let fDate =
        tempDate.getDate() +
        "/" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
      setFecProxima(tempDate);
      setTextProxima(fDate);
      console.log("Fecha Proxima", fDate);
    }
  };

  const showModeProxima = (currentMode) => {
    setShowProxima(true);
    setModeProxima(currentMode);
    form.reset;
  };

  const updateDocVacuna = (data) => {
    if (textActual === "" || textProxima === "") {
      if (Platform.OS === "web") {
        alert("Debe Ingresar una Fecha Valida");
      } else {
        Alert.alert("Error", "Deber Ingresar una Fecha Valida");
      }
      return false;
    } else if (checkDates(dateActual, dateProxima)) {
      if (Platform.OS === "web") {
        alert(
          "La fecha próxima no puede ser menor a la fecha actual de aplicación"
        );
      } else {
        Alert.alert(
          "Error",
          "La fecha próxima no puede ser menor a la fecha actual de aplicación"
        );
      }
      return false;
    } else {
      Alert.alert(
        "Confirmación",
        "Desea modificar la informacion de la vacuna?",
        [
          {
            text: "Aceptar",
            onPress: () => {
              setLoading(true);
              data.fecha = fecActual;
              data.proximaDosis = fecProxima;
              updateDoc(
                doc(db, "patients", idPaciente, "vacunas", id),
                data
              )
                .then((ocRef) => {
                  Alert.alert(
                    "Exito",
                    "Se actualizo la vacuna correctamente",
                    [
                      {
                        text: "Aceptar",
                        onPress: () => {
                          setLoading(false);
                          navigation.goBack();
                        },
                      },
                    ]
                  );
                  if (Platform.OS === "web") {
                    alert("Se actualizo la vacuna correctamente");
                    setLoading(false);
                  }
                })
                .catch((error) => {
                  setLoading(false);
                  Alert.alert(
                    "Error",
                    "Ocurrio un error al actualizar la vacuna"
                  );
                  if (Platform.OS === "web") {
                    alert("Ocurrio un error al actualizar la vacuna");
                    setLoading(false);
                  }
                });
              return true;
            },
          },
          {
            text: "Cancelar",
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={headerHeight}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <NativeBaseProvider>
        {loading ? (
          <ActivityIndicator
            style={styles.indicador}
            size="large"
            color="rgba(117, 140, 255, 1)"
          />
        ) : null}
        {vacuna ? (
          <ScrollView style={loading ? { opacity: 0.5 } : { opacity: 1 }}>
            <Box style={{ marginHorizontal: 5 }} mt={2} flex={1} p={1}>
              <HStack mt={5} flex={1} space={2}>
                <Heading
                  size="md"
                  alignSelf="center"
                  textAlign={"center"}
                  flex={1}
                >
                  Actualizar Vacuna
                </Heading>
                <Avatar
                  source={require("../../../assets/vacuna.png")}
                  size="large"
                  justifyContent="center"
                ></Avatar>
              </HStack>
              <Formik
                innerRef={form}
                enableReinitialize
                initialValues={{
                  nombre: vacuna.nombre,
                  marca: vacuna.marca,
                  tipo: vacuna.tipo,
                  dosis: vacuna.dosis,
                  peso: vacuna.peso,
                }}
                onSubmit={(values) => {
                  updateDocVacuna(values);
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
                          fontSize={15}
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
                          fontSize={15}
                          _focus={styles.inputSeleccionado}
                          placeholder="Digite Marca de Vacuna"
                          InputLeftElement={
                            <Icon
                              as={
                                <MaterialCommunityIcons name="registered-trademark" />
                              }
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
                          fontSize={15}
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
                      <FormControl isInvalid={"dosis" in errors}>
                        <FormControl.Label _text={styles.labelInput}>
                          Dosis:
                        </FormControl.Label>
                        <Input
                          fontSize={15}
                          _focus={styles.inputSeleccionado}
                          placeholder="Digite Dosis de Vacuna"
                          keyboardType="decimal-pad"
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
                          fontSize={15}
                          _focus={styles.inputSeleccionado}
                          placeholder="Digite el peso del Paciente"
                          InputLeftElement={
                            <Icon
                              as={
                                <MaterialCommunityIcons name="weight-pound" />
                              }
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
                      <FormControl>
                        <FormControl.Label _text={styles.labelInput}>
                          Fecha de Aplicación:
                        </FormControl.Label>
                        <Button
                          fontSize={15}
                          size="lg"
                          variant="outline"
                          leftIcon={
                            <Icon
                              as={MaterialCommunityIcons}
                              name="calendar"
                              size="sm"
                            />
                          }
                          onPress={() => showModeActual("date")}
                        >
                          {textActual.length > 1
                            ? textActual
                            : "Seleccione una Fecha"}
                        </Button>
                      </FormControl>
                      {showActual && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={dateActual}
                          mode={modeActual}
                          is24Hour={true}
                          display="default"
                          onChange={onChangeDateActual}
                          maximumDate={new Date()}
                        />
                      )}

                      <FormControl>
                        <FormControl.Label _text={styles.labelInput}>
                          Fecha de Proxima Aplicación:
                        </FormControl.Label>
                        <Button
                          fontSize={15}
                          size="lg"
                          variant="outline"
                          leftIcon={
                            <Icon
                              as={MaterialCommunityIcons}
                              name="calendar"
                              size="sm"
                            />
                          }
                          onPress={() => showModeProxima("date")}
                        >
                          {textProxima.length > 1
                            ? textProxima
                            : "Seleccione una Fecha"}
                        </Button>
                      </FormControl>
                      {showProxima && (
                        <DateTimePicker
                          testID="dateTimePicker2"
                          value={dateProxima}
                          mode={modeProxima}
                          is24Hour={true}
                          display="default"
                          minimumDate={addDays(dateActual, 1)}
                          onChange={onChangeDateProxima}
                        />
                      )}
                      <HStack mb={20} space={2} justifyContent="center">
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
                          disabled={loading ? true : false}
                        >
                          Guardar
                        </Ionicons.Button>
                        <Ionicons.Button
                          backgroundColor={"rgba(117, 140, 255, 1)"}
                          size={22}
                          onPress={() => {
                            resetForm();
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
        ) : null}
      </NativeBaseProvider>
    </KeyboardAvoidingView>
  );
}

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
    color: "#8796FF",
  },
  indicador: {
    position: "absolute",
    top: "50%",
    left: "25%",
    right: "25%",
  },
};
