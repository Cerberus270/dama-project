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


//ProgressBar
import * as Progress from 'react-native-progress';

// Validation Imports
import * as yup from "yup";
import { Formik } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Firebase Auth
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  signOut
} from "firebase/auth";

//Firebase FireStore
import { doc, setDoc } from "firebase/firestore";

export default function Register({ navigation }) {

  const [show, setShow] = useState(false);

  //Function that check is email is linked to another account in the app
  const checkAuthUser = (email, password) => {
    fetchSignInMethodsForEmail(auth, email)
      .then(async (signInMethods) => {
        signInMethods.length === 0
          ? await createAuthUser(email, password)
          : alert("Ya existe una cuenta vinculada a este correo electronico");
      })
      .catch((error) =>alert("Ocurrio un error al verificar su correo electronico"));
  };

  //Function that is responsible for creating the user with email and password and executes the function of sending mail
  const createAuthUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await sendEmail(userCredential.user);
      })
      .catch((error) => alert("Ocurrio un error al registrar su correo electronico"));
  };

  //Function that is responsible for send verification email, also execute the function of create Veterinario Doc
  const sendEmail = (user) => {
    sendEmailVerification(user)
      .then(async () => {
        await createVetDoc(user.uid);
      })
      .catch((error) => alert("Ocurrio un error al enviar el correo de verificacion"));
  };

  //Function that is responsible for create a Veterinario Doc
  const createVetDoc = async (uid) => {
    setDoc(doc(db, "veterinarios", uid), {
      nombres: null,
      apellidos: null,
      clinica: {
        nombre: null,
        direccion: null,
      },
      perfilCompleto: false,
    })
      .then(() =>alert("Se registro con exito, hemos enviado un correo de verificacion"))
      .catch((error) =>alert("Ocurrio un error al registrar su perfil"));
  };

  //Execute all process
  const createUser = async (values) => {
    const { email, password } = values;
    await checkAuthUser(email, password);
  };
  

  return (
    <NativeBaseProvider>
      <ScrollView>
        <Box  mt={8} flex={1} p={1}>
          <Heading
            size="lg"
            color="coolGray.800"
            _dark={{
              color: "warmGray.50",
            }}
            fontWeight="semibold"
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
          >
            ¡Registrate para Continuar!
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
                .email("Ingrese un email válido.")
                .required("Email requerido."),
              password: yup
                .string()
                .min(6, "La contraseña debe tener al menos 6 caracteres.")
                .required("Contraseña requerida."),
              passwordConfirm: yup
                .string()
                .required("Debe ingresar su contraseña nuevamente")
                .oneOf(
                  [yup.ref("password")],
                  "Las contraseñas deben coincidir."
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
                <VStack space={4} mt="5">
                  <FormControl isInvalid={"email" in errors}>
                    <FormControl.Label _text={styles.labelInput}>
                      Email
                    </FormControl.Label>
                    <Input
                      _focus={styles.inputSeleccionado}
                      placeholder="Escriba su Email"
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
                      Contraseña
                    </FormControl.Label>
                    <Input
                      _focus={styles.inputSeleccionado}
                      placeholder="Escriba su contraseña"
                      type={show ? "text" : "password"}
                      InputRightElement={
                        <Pressable onPress={() => setShow(!show)}>
                          <Icon
                            as={
                              <MaterialCommunityIcons
                                name={show ? "eye-outline" : "eye-off-outline"}
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
                      Confirmar contraseña
                    </FormControl.Label>
                    <Input
                      _focus={styles.inputSeleccionado}
                      placeholder="Repita su contraseña"
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
                  <Button
                    mt="2"
                    colorScheme="indigo"
                    onPress={handleSubmit}
                    _disabled={styles.botonDisabled}
                  >
                    Sign up
                  </Button>
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

};
