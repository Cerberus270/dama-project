import React, { useEffect, useState } from "react";
// Components Imports
import {
  NativeBaseProvider,
  ScrollView,
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  View,
  WarningOutlineIcon,
  Icon,
  Pressable,
} from "native-base";

import Ionicons from "react-native-vector-icons/Ionicons";

import { ActivityIndicator, Alert,KeyboardAvoidingView } from "react-native";

//ProgressBar
import * as Progress from "react-native-progress";

// Validation Imports
import * as yup from "yup";
import { Formik } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Firebase Auth
import { auth, db } from "../../../config/firebase";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

import { useHeaderHeight } from "@react-navigation/elements";

//Firebase FireStore
import { doc, setDoc } from "firebase/firestore";

export default function Register({ navigation }) {
  const [show, setShow] = useState(false);
  const [isUpload, setUpload] = useState(false);
  const headerHeight = useHeaderHeight();

  //Function that check is email is linked to another account in the app
  const checkAuthUser = async (email, password) => {
    setUpload(true);
    await fetchSignInMethodsForEmail(auth, email)
      .then(async (signInMethods) => {
        if (signInMethods.length === 0) {
          await createAuthUser(email, password);
        } else {
          Alert.alert(
            "Advertencia",
            "Ya existe una cuenta vinculada a este correo electronico"
          );
          setUpload(false);
        }
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "Ocurrio un error al verificar su correo electronico"
        );
        setUpload(false);
      });
  };

  //Function that is responsible for creating the user with email and password and executes the function of sending mail
  const createAuthUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await sendEmail(userCredential.user);
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "Ocurrio un error al registrar su correo electronico"
        );
        setUpload(false);
      });
  };

  //Function that is responsible for send verification email, also execute the function of create Veterinario Doc
  const sendEmail = (user) => {
    sendEmailVerification(user)
      .then(async () => {
        await createVetDoc(user.uid);
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "Ocurrio un error al enviar el correo de verificacion"
        );
        setUpload(false);
      });
  };

  //Function that is responsible for create a Veterinario Doc
  const createVetDoc = async (uid) => {
    await setDoc(doc(db, "veterinarios", uid), {
      nombres: null,
      apellidos: null,
      clinica: {
        nombre: null,
        direccion: null,
      },
      perfilCompleto: false,
    })
      .then(() => {
        Alert.alert(
          "Exito",
          "Se registro con exito, hemos enviado un correo de verificacion",
          [
            {
              text: "Aceptar",
              onPress: () => navigation.goBack(),
            },
          ],
          {
            cancelable: false,
          }
        );
        signOut(auth);
        setUpload(false);
      })
      .catch((error) => {
        Alert.alert("Error", "Ocurrio un error al registrar su perfil");
        setUpload(false);
      });
  };

  //Execute all process
  const createUser = async (values) => {
    const { email, password } = values;
    checkAuthUser(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={headerHeight}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <NativeBaseProvider>
        <ScrollView>
          {isUpload ? (
            <ActivityIndicator
              style={styles.indicador}
              size="large"
              color="rgba(117, 140, 255, 1)"
            />
          ) : null}
          <Box
            style={isUpload ? { opacity: 0.5 } : { opacity: 1 }}
            mt={8}
            flex={1}
            p={1}
          >
            <Heading
              size="lg"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
              fontWeight="semibold"
              alignSelf="center"
            >
              Bienvenido
            </Heading>
            <Heading
              mt="1"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
              fontWeight="medium"
              size="xs"
              alignSelf="center"
            >
              ??Registrate para Continuar!
            </Heading>
            <Formik
              initialValues={{
                email: "",
                password: "",
                passwordConfirm: "",
              }}
              onSubmit={(values) => createUser(values)}
              validationSchema={yup.object().shape({
                email: yup
                  .string()
                  .email("Ingrese un correo electronico v??lido.")
                  .required("Email requerido."),
                password: yup
                  .string()
                  .min(6, "La contrase??a debe tener al menos 6 caracteres.")
                  .required("Contrase??a requerida."),
                passwordConfirm: yup
                  .string()
                  .required("Debe ingresar su contrase??a nuevamente")
                  .oneOf(
                    [yup.ref("password")],
                    "Las contrase??as deben coincidir."
                  ),
              })}
            >
              {({
                values,
                handleChange,
                errors,
                touched,
                isValid,
                handleSubmit,
              }) => (
                <View>
                  <VStack space={4} mt="5" style={{ marginHorizontal: 5 }}>
                    <FormControl isInvalid={"email" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Correo electronico
                      </FormControl.Label>
                      <Input
                        style={{ fontSize: 15 }}
                        _focus={styles.inputSeleccionado}
                        placeholder="example@example.com"
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="gmail" />}
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                        value={values.email}
                        keyboardType={"email-address"}
                        onChangeText={handleChange("email")}
                      />
                      {touched.email && errors.email && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.email}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={"password" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Contrase??a
                      </FormControl.Label>
                      <Input
                        _focus={styles.inputSeleccionado}
                        placeholder="Escriba su contrase??a"
                        type={show ? "text" : "password"}
                        style={{ fontSize: 15 }}
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="lock" />}
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                        InputRightElement={
                          <Pressable onPress={() => setShow(!show)}>
                            <Icon
                              as={
                                <MaterialCommunityIcons
                                  name={
                                    show ? "eye-outline" : "eye-off-outline"
                                  }
                                />
                              }
                              size={5}
                              mr="2"
                              color="muted.400"
                            />
                          </Pressable>
                        }
                        value={values.password}
                        onChangeText={handleChange("password")}
                      />
                      {touched.password && errors.password && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.password}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={"passwordConfirm" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Confirmar contrase??a
                      </FormControl.Label>
                      <Input
                        _focus={styles.inputSeleccionado}
                        style={{ fontSize: 15 }}
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="lock" />}
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                        placeholder="Repita su contrase??a"
                        value={values.passwordConfirm}
                        type={show ? "text" : "password"}
                        onChangeText={handleChange("passwordConfirm")}
                      />
                      {touched.passwordConfirm && errors.passwordConfirm && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.passwordConfirm}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>

                    <Ionicons.Button
                      disabled={isUpload ? true : false}
                      backgroundColor={"rgba(117, 140, 255, 1)"}
                      size={22}
                      onPress={handleSubmit}
                      style={{
                        alignSelf: "stretch",
                        justifyContent: "center",
                      }}
                      name="create-outline"
                      _disabled={styles.botonDisabled}
                    >
                      Registrarme
                    </Ionicons.Button>
                  </VStack>
                </View>
              )}
            </Formik>
          </Box>
        </ScrollView>
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
