import { View, Alert } from "react-native";
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
  Button
} from "native-base";
import { Avatar } from "react-native-elements";
import { useState } from "react";
import { auth, db } from "../../../config/firebase";
import { doc, getDoc, setDoc, onSnapshot, collection, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Formik, getIn } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Radio } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function UpdatePaciente({ navigation, route }) {
  const {id} = route.params;
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(false);
  //Date Picker
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [text, setText] = useState("");
  const [fecNac, setFecNac] = useState(new Date());

  const regexPhone = /^[0-9]{4}-[0-9]{4}$/;

  const form = useRef();

  const timestampToDate = (valorTimestamp) => {
    return new Date(valorTimestamp * 1000).toLocaleDateString("en-US");
  };


  const updateDocPaciente = (data) => {
    if (text === "") {
      if (Platform.OS === "web") {
        alert("Debe Ingresar una Fecha Valida");
      } else {
        Alert.alert("Deber Ingresar una Fecha Valida");
      }
      return false;
    } else {
      setLoading(true);
      data.fechaNacimiento = fecNac;
      updateDoc(doc(db, "patients", id), data)
        .then((ocRef) => {
          Alert.alert("Exito", "Se actualizo el paciente correctamente", [
            {
              text: "Aceptar",
              onPress: () => {
                setLoading(false);
                navigation.goBack();
              }
            },
          ]);
          if (Platform.OS === "web") {
            alert("Se actualizo el paciente correctamente");
            setLoading(false);
            navigation.goBack();
          }
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert("Error", "Ocurrio un error al actualizar el paciente");
          if (Platform.OS === "web") {
            alert("Ocurrio un error al actualizar el paciente");
            setLoading(false);
          }
        });
      return true;
    }
  };

  const avatarPic = (typePaciente) => {
    const avatar = {
      Canino: require("../../../assets/avatars-tipo/perro.png"),
      Felino: require("../../../assets/avatars-tipo/gato.png"),
      Ave: require("../../../assets/avatars-tipo/aguila.png"),
      Roedor: require("../../../assets/avatars-tipo/rata.png"),
      Reptil: require("../../../assets/avatars-tipo/reptil.png"),
      Anfibio: require("../../../assets/avatars-tipo/rana.png"),
      Insecto: require("../../../assets/avatars-tipo/insecto.png"),
    };
    return avatar[typePaciente];
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const unsuscribe = onSnapshot(
        doc(db, "patients", id),
        (doc) => {
          if (doc.exists()) {
            setPaciente(doc.data());
            setText(timestampToDate(doc.data().fechaNacimiento.seconds))
            setDate(new Date(doc.data().fechaNacimiento.seconds * 1000))
            setLoading(false);
            console.log(doc.data());
          } else {
            setPaciente(null);
            Alert.alert(
              "Error",
              "No hemos podido localizar este paciente, contacte con soporte",
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
        setPaciente(null);
        setLoading(false);
      };
    }, [])
  );

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    if (event.type === "set") {
      let tempDate = new Date(currentDate);
      let fDate =
        tempDate.getDate() +
        "/" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
      setFecNac(tempDate);
      setText(fDate);
      console.log(fDate);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
    form.reset;
  };

  const formikRef = useRef();

  return (
    <NativeBaseProvider>
      {loading ? (
        <ActivityIndicator
          style={styles.indicador}
          size="large"
          color="rgba(117, 140, 255, 1)"
        />
      ) : null}
      {paciente ? (
        <ScrollView style={loading ? { opacity: 0.5 } : { opacity: 1 }}>
          <Box style={{ marginHorizontal: 5 }} mt={4} flex={1} p={1}>
            <HStack mt={5} flex={1} space={2}>
              <Heading size="xl" alignSelf="center" flex={1}>
                Actualizar Paciente
              </Heading>
              <Avatar
                source={avatarPic(paciente.tipo)}
                size="large"
                justifyContent="center"

              >
              </Avatar>
            </HStack>
            <Formik
              innerRef={formikRef}
              enableReinitialize
              initialValues={{
                nombre: paciente.nombre,
                tipo: paciente.tipo,
                raza: paciente.raza,
                sexo: paciente.sexo,
                peso: paciente.peso,
                propietario: {
                  nombre: paciente.propietario.nombre,
                  telefono: paciente.propietario.telefono,
                  direccion: paciente.propietario.direccion,
                }
              }}
              validationSchema={yup.object().shape({
                nombre: yup
                  .string()
                  .min(2, "Minimo 2 caracteres")
                  .required("Nombre mascota requerido."),
                tipo: yup.string().required("Tipo de Paciente requerido"),
                raza: yup.string().min(4, "Minimo 4 caracteres").required("Raza requerida"),
                sexo: yup.string().required("Sexo paciente requerido"),
                peso: yup
                  .number()
                  .min(0, "Ingrese un peso mayor a 0 lb")
                  .required("Peso del paciente requerido"),
                propietario: yup.object().shape({
                  nombre: yup
                    .string()
                    .min(4, "Minimo 4 caracteres")
                    .required("Nombre requerido."),
                  telefono: yup
                    .string()
                    .required("Telefono requerido.")
                    .matches(regexPhone, "Formato XXXX-XXXX"),
                  direccion: yup
                    .string()
                    .min(6, "Minimo 6 caracteres")
                    .required("Direccion requerida"),
                }),
              })}
              onSubmit={(values) => {
                Alert.alert("Confirmacion", "Desea modificar la informacion del paciente", [
                  {
                    text: "Aceptar",
                    onPress: () => {
                      updateDocPaciente(values);
                    }
                  },
                  {
                    text: "Cancelar"
                  }
                ])
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
                    <FormControl isInvalid={"nombre" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Nombre Paciente:
                      </FormControl.Label>
                      <Input
                      fontSize={15}
                        _focus={styles.inputSeleccionado}
                        placeholder="Digite el nombre del paciente"
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="dog" />}
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

                    <FormControl isInvalid={"tipo" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Tipo Paciente:
                      </FormControl.Label>
                      <Select
                      fontSize={15}
                        minWidth="200"
                        accessibilityLabel="Tipo de Paciente"
                        placeholder="Tipo de Paciente"
                        onValueChange={handleChange("tipo")}
                        selectedValue={values.tipo}
                        _selectedItem={{
                          bg: "teal.600",
                          endIcon: <CheckIcon size={5} />,
                        }}
                        mt="1"
                      >
                        <Select.Item label="Canino" value="Canino" />
                        <Select.Item label="Felino" value="Felino" />
                        <Select.Item label="Ave" value="Ave" />
                        <Select.Item label="Roedor" value="Roedor" />
                        <Select.Item label="Reptil" value="Reptil" />
                        <Select.Item label="Anfibio" value="Anfibio" />
                        <Select.Item label="Insecto" value="Insecto" />
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
                        Raza Paciente:
                      </FormControl.Label>
                      <Input
                      fontSize={15}
                        _focus={styles.inputSeleccionado}
                        placeholder="Digite la raza del paciente"
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="dog-side" />}
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

                    <FormControl isInvalid={"sexo" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Sexo Paciente:
                      </FormControl.Label>
                      <Radio.Group
                        name="rSexo"
                        accessibilityLabel="Sexo paciente"
                        value={values.sexo}
                        onChange={handleChange("sexo")}
                      >
                        <Radio value="Macho" my={1}>
                          Macho
                        </Radio>
                        <Radio value="Hembra" my={1}>
                          Hembra
                        </Radio>
                      </Radio.Group>
                      {touched.sexo && errors.sexo && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.sexo}
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
                    <FormControl>
                      <FormControl.Label _text={styles.labelInput}>
                        Fecha de Nacimiento:
                      </FormControl.Label>
                      <Button
                      fontSize={15}
                        size="sm"
                        variant="outline"
                        leftIcon={
                          <Icon
                            as={MaterialCommunityIcons}
                            name="calendar"
                            size="sm"
                          />
                        }
                        onPress={() => showMode("date")}
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
                        maximumDate={new Date()}
                        onChange={onChangeDate}
                      />
                    )}

                    <FormControl isInvalid={getIn(errors, "propietario.nombre")}>
                      <FormControl.Label _text={styles.labelInput}>
                        Nombre Propietario:
                      </FormControl.Label>
                      <Input
                      fontSize={15}
                        _focus={styles.inputSeleccionado}
                        placeholder="Digite el nombre del propietario"
                        InputLeftElement={
                          <Icon
                            as={
                              <MaterialCommunityIcons name="account-cowboy-hat" />
                            }
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                        value={values.propietario.nombre}
                        onChangeText={handleChange("propietario.nombre")}
                        onBlur={() => setFieldTouched("propietario.nombre")}
                      />
                      {getIn(touched, "propietario.nombre") &&
                        getIn(errors, "propietario.nombre") && (
                          <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}
                          >
                            {getIn(errors, "propietario.nombre")}
                          </FormControl.ErrorMessage>
                        )}
                    </FormControl>
                    <FormControl
                      isInvalid={getIn(errors, "propietario.telefono")}
                    >
                      <FormControl.Label _text={styles.labelInput}>
                        Telefono Propietario:
                      </FormControl.Label>
                      <Input
                      fontSize={15}
                        _focus={styles.inputSeleccionado}
                        placeholder="Digite Telefono del Propietario"
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="phone" />}
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                        value={values.propietario.telefono}
                        keyboardType={"number-pad"}
                        onChangeText={handleChange("propietario.telefono")}
                        onBlur={() => setFieldTouched("propietario.telefono")}
                      />
                      {getIn(touched, "propietario.telefono") &&
                        getIn(errors, "propietario.telefono") && (
                          <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}
                          >
                            {getIn(errors, "propietario.telefono")}
                          </FormControl.ErrorMessage>
                        )}
                    </FormControl>
                    <FormControl
                      isInvalid={getIn(errors, "propietario.direccion")}
                    >
                      <FormControl.Label _text={styles.labelInput}>
                        Direccion Propietario:
                      </FormControl.Label>
                      <Input
                      fontSize={15}
                        _focus={styles.inputSeleccionado}
                        placeholder="Digite la direccion del Propietario"
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="home-map-marker" />}
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                        value={values.propietario.direccion}
                        onChangeText={handleChange("propietario.direccion")}
                        onBlur={() => setFieldTouched("propietario.direccion")}
                      />
                      {getIn(touched, "propietario.direccion") &&
                        getIn(errors, "propietario.direccion") && (
                          <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}
                          >
                            {getIn(errors, "propietario.direccion")}
                          </FormControl.ErrorMessage>
                        )}
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
