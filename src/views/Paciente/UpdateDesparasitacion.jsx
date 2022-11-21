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
import { checkDates, addDays, timestampToDate } from "../../../utils/utils";

export default function UpdateDesparasitacion({ navigation, route }) {
  const { idPaciente } = route.params;
  const { id } = route.params.desparasitacion;
  const [desparasitacion, setDesparasitacion] = useState(null);
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

  const form = useRef();

  const updateDocPaciente = (data) => {
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
        "Desea modificar la informacion de la desparasitación?",
        [
          {
            text: "Aceptar",
            onPress: () => {
              setLoading(true);
              data.fecha = fecActual;
              data.proximaDosis = fecProxima;
              updateDoc(
                doc(db, "patients", idPaciente, "desparasitacion", id),
                data
              )
                .then((ocRef) => {
                  Alert.alert(
                    "Exito",
                    "Se actualizo la desparasitación correctamente",
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
                    alert("Se actualizo la desparasitacion correctamente");
                    setLoading(false);
                  }
                })
                .catch((error) => {
                  setLoading(false);
                  Alert.alert(
                    "Error",
                    "Ocurrio un error al actualizar la desparasitación"
                  );
                  if (Platform.OS === "web") {
                    alert("Ocurrio un error al actualizar la desparasitación");
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

  useFocusEffect(
    React.useCallback(() => {
      console.log(id, idPaciente);
      setLoading(true);
      const unsuscribe = onSnapshot(
        doc(db, "patients", idPaciente, "desparasitacion", id),
        (doc) => {
          if (doc.exists()) {
            console.log(doc.data());
            setDesparasitacion(doc.data());
            setTextActual(timestampToDate(doc.data().fecha.seconds));
            setDateActual(new Date(doc.data().fecha.seconds * 1000));
            setFecActual(new Date(doc.data().fecha.seconds * 1000))
            //Proxima Dosis
            setTextProxima(timestampToDate(doc.data().proximaDosis.seconds));
            setDateProxima(new Date(doc.data().proximaDosis.seconds * 1000));
            setFecProxima(new Date(doc.data().proximaDosis.seconds * 1000))
            setLoading(false);
          } else {
            setDesparasitacion(null);
            Alert.alert(
              "Error",
              "No hemos podido localizar este desparasitación, contacte con soporte",
              [
                {
                  text: "Aceptar",
                  onPress: async () => {
                    await signOut(auth);
                    navigation.reset({
                      index: 0,
                      routes: [
                        {
                          name: "Login",
                        },
                      ],
                    });
                  },
                },
              ]
            );
          }
        }
      );

      return () => {
        unsuscribe();
        setDesparasitacion(null);
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
        (tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()) +
        "/" +
        ((tempDate.getMonth() + 1) < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1) +
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
        (tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()) +
        "/" +
        ((tempDate.getMonth() + 1) < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1) +
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

  const formikRef = useRef();

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
        {desparasitacion ? (
          <ScrollView style={loading ? { opacity: 0.5 } : { opacity: 1 }}>
            <Box style={{ marginHorizontal: 5 }} mt={4} flex={1} p={1}>
              <HStack mt={5} flex={1} space={2}>
                <Heading size="md" alignSelf="center" flex={1}>
                  Actualizar Desparasitación
                </Heading>
                <Avatar
                  source={require("../../../assets/atenciones-tipo/parasite.png")}
                  size="large"
                  justifyContent="center"
                ></Avatar>
              </HStack>
              <Formik
                innerRef={formikRef}
                enableReinitialize
                initialValues={{
                  marca: desparasitacion.marca,
                }}
                validationSchema={yup.object().shape({
                  marca: yup
                    .string()
                    .min(2, "Minimo 2 caracteres")
                    .required("Nombre mascota requerido."),
                })}
                onSubmit={(values) => {
                  updateDocPaciente(values);
                }}
              >
                {({
                  values,
                  handleChange,
                  setFieldTouched,
                  errors,
                  touched,
                  isValid,
                  handleSubmit,
                  resetForm,
                }) => (
                  <View>
                    <VStack space={4} mt="5">
                      <FormControl isInvalid={"marca" in errors}>
                        <FormControl.Label _text={styles.labelInput}>
                          Desparasitante:
                        </FormControl.Label>
                        <Input
                          fontSize={15}
                          _focus={styles.inputSeleccionado}
                          placeholder="Digite el Desparasitante"
                          InputLeftElement={
                            <Icon
                              as={<MaterialCommunityIcons name="dog" />}
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
                            formikRef.current?.resetForm();
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
