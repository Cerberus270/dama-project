import React, { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView } from "react-native";
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
import { ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useHeaderHeight } from "@react-navigation/elements";

const CreateDesparasitacion = ({ navigation, route }) => {
  const { id } = route.params;
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [text, setText] = useState("");
  const [proxD, setProxD] = useState(new Date());
  const [uploading, setUploading] = useState(false);
  const headerHeight = useHeaderHeight();

  const fechaProxMin = new Date();
  fechaProxMin.setDate(fechaProxMin.getDate() + 1);

  const form = useRef();

  const formularioValidacion = yup.object().shape({
    marca: yup
      .string()
      .min(2, "Minimo 2 caracteres")
      .required("Desparasitante requerido")
  });

  const valoresIniciales = {
    marca: "",
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
        alert("Debe Ingresar una Fecha Válida");
      } else {
        Alert.alert("Error","Deber Ingresar una Fecha Válida");
      }
      return false;
    } else {
      setUploading(true);
      data.proximaDosis = proxD;
      data.fecha = new Date();
      addDoc(collection(db, "patients", id, "desparasitacion"), data)
        .then((ocRef) => {
          setUploading(false);
          Alert.alert("Éxito", "Se registró la desparasitación correctamente", [
            {
              text: "Aceptar",
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
          if (Platform.OS === "web") {
            Alert.alert("Éxito","Se registró la desparasitación  correctamente");
            navigation.goBack();
          }
        })
        .catch((error) => {
          setUploading(false);
          Alert.alert(
            "Error",
            "Ocurrio un error al registrar la desparasitación"
          );
          if (Platform.OS === "web") {
            Alert.alert("Error","Ocurrio un error al registrar la desparasitación");
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
        setShow(false);
        setText("");
        setUploading(false);
      };
    }, [])
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={headerHeight}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <NativeBaseProvider>
        {uploading ? (
          <ActivityIndicator
            style={styles.indicador}
            size="large"
            color="rgba(117, 140, 255, 1)"
          />
        ) : null}
        <ScrollView style={uploading ? { opacity: 0.5 } : { opacity: 1 }}>
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
                <View style={{ marginHorizontal: 5 }}>
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
                    <FormControl onTouchStart={() => showMode("date")}>
                      <FormControl.Label _text={styles.labelInput}>
                        Próxima dosis:
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
                        minimumDate={fechaProxMin}
                      />
                    )}
                    <HStack mb={5} space={2} justifyContent="center">
                      <Ionicons.Button
                        disabled={uploading ? true : false}
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
                          form.current?.resetForm();
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
    </KeyboardAvoidingView>
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
  indicador: {
    position: "absolute",
    top: "50%",
    left: "25%",
    right: "25%",
  },
};
export default CreateDesparasitacion;
