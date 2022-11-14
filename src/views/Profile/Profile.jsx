import { Text, View, Alert } from "react-native";
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
  Avatar,
} from "native-base";
import { useState } from "react";
import { auth, db } from "../../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Formik } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRef } from "react";

export default function Profile({ navigation }) {
  const [veterinario, setVeterinario] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateDocVeterinario = (values) => {
    setLoading(true);
    const {
      nombres,
      apellidos,
      perfilCompleto,
      nombreClinica,
      direccionClinica,
    } = values;
    setDoc(doc(db, "veterinarios", auth.currentUser.uid), {
      nombres: nombres,
      apellidos: apellidos,
      perfilCompleto: perfilCompleto,
      clinica: {
        nombre: nombreClinica,
        direccion: direccionClinica,
      },
    })
      .then((message) => {
        Alert.alert("Exito", "Se perfil fue actualizado correctamente");
        setLoading(false);
        getVeterinarioDoc(auth.currentUser.uid);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Error", "Ocurrio un actualizar su perfil");
      });
  };

  const getVeterinarioDoc = async (uid) => {
    setLoading(true);
    const veterinarioRef = doc(db, "veterinarios", uid);
    const veterinarioSnap = await getDoc(veterinarioRef);
    if (veterinarioSnap.exists()) {
      const veterinario = veterinarioSnap.data();
      setLoading(false);
      setVeterinario(veterinario);
    }
  };

  useEffect(async () => {
    await getVeterinarioDoc(auth.currentUser.uid);
  }, []);

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
      {veterinario ? (
        <ScrollView style={loading ? { opacity: 0.5 } : { opacity: 1 }}>
          <Box style={{marginHorizontal:5}} mt={4} flex={1} p={1}>
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
              <Heading size='md' alignSelf='center' flex={1}>{auth.currentUser.email}</Heading>
              <Avatar
                source={{
                  uri: "https://us.123rf.com/450wm/yupiramos/yupiramos1804/yupiramos180421545/100217337-m%C3%A9dico-veterinario-con-perro-avatar-ilustraci%C3%B3n-vectorial-character-design.jpg?ver=6",
                }}
                size="xl"
                justifyContent="center"
              >
                <Avatar.Badge bg={"green.500"} />
              </Avatar>
            </HStack>
            <Formik
              innerRef={formikRef}
              enableReinitialize
              initialValues={{
                nombres: veterinario.nombres,
                apellidos: veterinario.apellidos,
                nombreClinica: veterinario.clinica.nombre,
                direccionClinica: veterinario.clinica.direccion,
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
                        _focus={styles.inputSeleccionado}
                        placeholder="Digite su nombre"
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="face-profile" />}
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
                      {touched.direccionClinica && errors.direccionClinica && (
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
                            getVeterinarioDoc(auth.currentUser.uid);
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
