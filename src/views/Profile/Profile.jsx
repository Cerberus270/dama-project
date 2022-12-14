import { Text, View, Alert, KeyboardAvoidingView } from "react-native";
import React, { Component } from "react";
import * as yup from "yup";
import {
  NativeBaseProvider,
  ScrollView,
  Box,
  Heading,
  Input,
  FormControl,
  WarningOutlineIcon,
  Icon,
  VStack,
  HStack,
} from "native-base";
import { Avatar } from "react-native-elements";
import { useState } from "react";
import { auth, db } from "../../../config/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Formik } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Radio } from "native-base";
import { useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";

export default function Profile({ navigation }) {
  const [veterinario, setVeterinario] = useState(null);
  const [loading, setLoading] = useState(false);
  const headerHeight = useHeaderHeight();

  const avatarSexo = (sexo) => {
    const avatar = {
      Masculino: require("../../../assets/veterinario-masculino.png"),
      Femenino: require("../../../assets/veterinario-femenino.png"),
    };
    return avatar[sexo];
  };

  const updateDocVeterinario = (values) => {
    setLoading(true);
    const {
      nombres,
      apellidos,
      perfilCompleto,
      nombreClinica,
      direccionClinica,
      sexo,
    } = values;
    setDoc(doc(db, "veterinarios", auth.currentUser.uid), {
      nombres: nombres,
      apellidos: apellidos,
      perfilCompleto: perfilCompleto,
      sexo: sexo,
      clinica: {
        nombre: nombreClinica,
        direccion: direccionClinica,
      },
    })
      .then((message) => {
        Alert.alert("Exito", "Se perfil fue actualizado correctamente");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Error", "Ocurrio un actualizar su perfil");
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const unsuscribe = onSnapshot(
        doc(db, "veterinarios", auth.currentUser.uid),
        (doc) => {
          if (doc.exists()) {
            setVeterinario(doc.data());
            setLoading(false);
          } else {
            setVeterinario(null);
            Alert.alert(
              "Error",
              "No hemos podido localizar su perfil, contacte con soporte",
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
        setVeterinario(null);
        setLoading(false);
      };
    }, [])
  );

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
        {veterinario ? (
          <ScrollView style={loading ? { opacity: 0.5 } : { opacity: 1 }}>
            <Box style={{ marginHorizontal: 5 }} mt={4} flex={1} p={1}>
              <Heading
                size="xl"
                color="coolGray.800"
                _dark={{
                  color: "warmGray.50",
                }}
                fontWeight="bold"
                alignSelf="center"
              >
                Gestiona tu perfil
              </Heading>
              <HStack mt={5} flex={1} space={2}>
                <Heading size="sm" alignSelf="center" flex={1}>
                  {auth.currentUser.email}
                </Heading>
                <Avatar
                  source={avatarSexo(veterinario.sexo)}
                  size="large"
                  justifyContent="center"
                ></Avatar>
              </HStack>
              <Formik
                innerRef={formikRef}
                enableReinitialize
                initialValues={{
                  nombres: veterinario.nombres,
                  apellidos: veterinario.apellidos,
                  nombreClinica: veterinario.clinica.nombre,
                  direccionClinica: veterinario.clinica.direccion,
                  sexo: veterinario.sexo,
                  perfilCompleto: true,
                }}
                validationSchema={yup.object().shape({
                  nombres: yup
                    .string()
                    .min(
                      4,
                      "Consideramos que su nombre es muy corto, ingrese mas de 4 caracteres"
                    )
                    .required("Necesitamos su nombre"),
                  apellidos: yup
                    .string()
                    .min(
                      4,
                      "Consideramos que su apellido es muy corto, ingrese mas de 4 caracteres"
                    )
                    .required("Necesitamos su apellido"),
                  sexo: yup.string().required("Seleccione una opcion"),
                  nombreClinica: yup
                    .string()
                    .min(
                      6,
                      "Consideramos que el nombre de la clinica es muy corto, ingrese mas de 6 caracteres"
                    )
                    .required("Necesitamos el nombre de su clinica"),
                  direccionClinica: yup
                    .string()
                    .min(
                      10,
                      "Consideramos que la direccion de la clinica es muy corta, ingrese mas de 10 caracteres"
                    )
                    .required("Necesitamos la direccion de su clinica"),
                })}
                onSubmit={(values) => {
                  Alert.alert(
                    "Confirmacion",
                    "Desea modificar la informacion de su perfil",
                    [
                      {
                        text: "Aceptar",
                        onPress: () => {
                          updateDocVeterinario(values);
                        },
                      },
                      {
                        text: "Cancelar",
                      },
                    ]
                  );
                }}
              >
                {({
                  values,
                  handleChange,
                  errors,
                  touched,
                  isValid,
                  handleSubmit,
                }) => (
                  <View style={{ marginHorizontal: 5 }}>
                    <VStack mt={5} space={2}>
                      <FormControl isInvalid={"nombres" in errors}>
                        <FormControl.Label _text={styles.labelInput}>
                          Nombre
                        </FormControl.Label>
                        <Input
                          fontSize={15}
                          _focus={styles.inputSeleccionado}
                          placeholder="Digite su nombre"
                          InputLeftElement={
                            <Icon
                              as={<MaterialCommunityIcons name="account" />}
                              size={5}
                              ml="2"
                              color="muted.400"
                            />
                          }
                          value={values.nombres}
                          onChangeText={handleChange("nombres")}
                        />
                        {touched.nombres && errors.nombres && (
                          <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}
                          >
                            {errors.nombres}
                          </FormControl.ErrorMessage>
                        )}
                      </FormControl>
                      <FormControl isInvalid={"apellidos" in errors}>
                        <FormControl.Label _text={styles.labelInput}>
                          Apellidos
                        </FormControl.Label>
                        <Input
                          fontSize={15}
                          _focus={styles.inputSeleccionado}
                          placeholder="Digite sus apellidos"
                          InputLeftElement={
                            <Icon
                              as={
                                <MaterialCommunityIcons name="form-textbox" />
                              }
                              size={5}
                              ml="2"
                              color="muted.400"
                            />
                          }
                          value={values.apellidos}
                          onChangeText={handleChange("apellidos")}
                        />
                        {touched.apellidos && errors.apellidos && (
                          <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}
                          >
                            {errors.apellidos}
                          </FormControl.ErrorMessage>
                        )}
                      </FormControl>
                      <FormControl isInvalid={"sexo" in errors}>
                        <FormControl.Label _text={styles.labelInput}>
                          Sexo:
                        </FormControl.Label>
                        <Radio.Group
                          name="rSexo"
                          accessibilityLabel="Sexo"
                          value={values.sexo}
                          onChange={handleChange("sexo")}
                        >
                          <Radio value="Masculino" my={1}>
                            Masculino
                          </Radio>
                          <Radio value="Femenino" my={1}>
                            Femenino
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
                    </VStack>
                    <Heading
                      size="lg"
                      color="coolGray.800"
                      _dark={{
                        color: "warmGray.50",
                      }}
                      mt={5}
                      fontWeight="bold"
                      alignSelf="center"
                    >
                      Clinica
                    </Heading>
                    <VStack mt={2} space={3}>
                      <FormControl isInvalid={"nombreClinica" in errors}>
                        <FormControl.Label _text={styles.labelInput}>
                          Nombre Clinica
                        </FormControl.Label>
                        <Input
                          fontSize={15}
                          _focus={styles.inputSeleccionado}
                          placeholder="Digite el nombre de su clinica"
                          InputLeftElement={
                            <Icon
                              as={
                                <MaterialCommunityIcons name="hospital-building" />
                              }
                              size={5}
                              ml="2"
                              color="muted.400"
                            />
                          }
                          value={values.nombreClinica}
                          onChangeText={handleChange("nombreClinica")}
                        />
                        {touched.nombreClinica && errors.nombreClinica && (
                          <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}
                          >
                            {errors.nombreClinica}
                          </FormControl.ErrorMessage>
                        )}
                      </FormControl>
                      <FormControl isInvalid={"direccionClinica" in errors}>
                        <FormControl.Label _text={styles.labelInput}>
                          Direccion Clinica
                        </FormControl.Label>
                        <Input
                          fontSize={15}
                          _focus={styles.inputSeleccionado}
                          placeholder="Digite la direccion de su clinica"
                          InputLeftElement={
                            <Icon
                              as={
                                <MaterialCommunityIcons name="hospital-marker" />
                              }
                              size={5}
                              ml="2"
                              color="muted.400"
                            />
                          }
                          value={values.direccionClinica}
                          onChangeText={handleChange("direccionClinica")}
                        />
                        {touched.direccionClinica &&
                          errors.direccionClinica && (
                            <FormControl.ErrorMessage
                              leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                              {errors.direccionClinica}
                            </FormControl.ErrorMessage>
                          )}
                      </FormControl>
                      <HStack
                        space={2}
                        alignSelf="center"
                        style={{
                          justiftyContent: "center",
                          alignItems: "center",
                          margin: 10,
                        }}
                      >
                        <View>
                          <Ionicons.Button
                            disabled={loading ? true : false}
                            backgroundColor={"rgba(117, 140, 255, 1)"}
                            size={22}
                            onPress={handleSubmit}
                            style={{
                              alignSelf: "center",
                            }}
                            name="save"
                          >
                            Guardar Cambios
                          </Ionicons.Button>
                        </View>
                        <View>
                          <Ionicons.Button
                            disabled={loading ? true : false}
                            backgroundColor={"rgba(117, 140, 255, 1)"}
                            size={22}
                            onPress={async () => {
                              formikRef.current?.resetForm();
                            }}
                            style={{
                              alignSelf: "center",
                            }}
                            name="refresh-outline"
                          >
                            Reestablecer
                          </Ionicons.Button>
                        </View>
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
