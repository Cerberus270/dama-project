import { Formik } from "formik";
import * as yup from "yup";
import {
  Box,
  NativeBaseProvider,
  ScrollView,
  Heading,
  VStack,
  Icon,
  FormControl,
  Input,
  WarningOutlineIcon,
  View,
} from "native-base";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Radio } from "native-base";

import { ActivityIndicator, Alert } from "react-native";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../../config/firebase";
import { signOut } from "firebase/auth";

export default function CompleteProfile({ navigation }) {
  const [isLoading, setLoading] = useState(false);

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
        Alert.alert(
          "Exito",
          "Se completo su registro, ahora puedes disfrutar de todos los beneficios de la aplicacion",
          [
            {
              text: "Aceptar",
              onPress: async () => {
                setLoading(false);
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "AppMain",
                    },
                  ],
                });
              },
            },
          ],
          {
            cancelable: false,
          }
        );
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Error", "Ocurrio un error al completar su perfil");
      });
  };

  return (
    <NativeBaseProvider>
      <ScrollView>
        {isLoading ? (
          <ActivityIndicator
            style={styles.indicador}
            size="large"
            color="rgba(56, 109, 255, 0.58)"
          />
        ) : null}
        <Box
          mt={8}
          flex={1}
          p={1}
          style={isLoading ? { opacity: 0.5 } : { opacity: 1 }}
        >
          <Heading
            size="lg"
            color="coolGray.800"
            _dark={{
              color: "warmGray.50",
            }}
            fontWeight="bold"
            alignSelf="center"
          >
            Bienvenido Veterinario
          </Heading>
          <Heading
            mt="1"
            color="coolGray.600"
            _dark={{
              color: "warmGray.200",
            }}
            fontWeight="medium"
            size="md"
            alignSelf="center"
          >
            ¡Cuentanos sobre ti!
          </Heading>
          <Formik
            initialValues={{
              nombres: "",
              apellidos: "",
              nombreClinica: "",
              direccionClinica: "",
              sexo: "",
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
              updateDocVeterinario(values);
            }}
          >
            {({ values, handleChange, errors, touched, handleSubmit }) => (
              <View style={{ marginHorizontal: 5 }}>
                <VStack mt={5} space={2}>
                  <FormControl isInvalid={"nombres" in errors}>
                    <FormControl.Label _text={styles.labelInput}>
                      Nombre
                    </FormControl.Label>
                    <Input
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
                      _focus={styles.inputSeleccionado}
                      placeholder="Digite sus apellidos"
                      InputLeftElement={
                        <Icon
                          as={<MaterialCommunityIcons name="form-textbox" />}
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
                <Heading
                  mt="1"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                  fontWeight="medium"
                  size="md"
                  alignSelf="center"
                >
                  ¡Cuentanos sobre tu clinica!
                </Heading>
                <VStack mt={5} space={3}>
                  <FormControl isInvalid={"nombreClinica" in errors}>
                    <FormControl.Label _text={styles.labelInput}>
                      Nombre Clinica
                    </FormControl.Label>
                    <Input
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
                      _focus={styles.inputSeleccionado}
                      placeholder="Digite la direccion de su clinica"
                      InputLeftElement={
                        <Icon
                          as={<MaterialCommunityIcons name="hospital-marker" />}
                          size={5}
                          ml="2"
                          color="muted.400"
                        />
                      }
                      value={values.direccionClinica}
                      onChangeText={handleChange("direccionClinica")}
                    />
                    {touched.direccionClinica && errors.direccionClinica && (
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.direccionClinica}
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>
                  <View
                    style={{
                      justiftyContent: "center",
                      alignItems: "center",
                      margin: 10,
                    }}
                  >
                    <Ionicons.Button
                      disabled={isLoading ? true : false}
                      backgroundColor={"rgba(117, 140, 255, 1)"}
                      size={22}
                      onPress={handleSubmit}
                      style={{
                        alignSelf: "center",
                      }}
                      name="save"
                    >
                      Guardar
                    </Ionicons.Button>
                  </View>
                </VStack>
              </View>
            )}
          </Formik>
        </Box>
      </ScrollView>
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
