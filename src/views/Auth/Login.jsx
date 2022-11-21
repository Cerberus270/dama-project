import React, { useState, useEffect } from "react";
import { ActivityIndicator, KeyboardAvoidingView } from "react-native";
import {
  NativeBaseProvider,
  Box,
  Heading,
  Input,
  Text,
  Icon,
  View,
  Image,
  VStack,
  FormControl,
  Button,
  HStack,
  Link,
  ScrollView,
  Pressable,
} from "native-base";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../../config/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const headerHeight = useHeaderHeight();

  const getVeterinarioDoc = async (uid) => {
    if (auth.currentUser.emailVerified) {
      const veterinarioRef = doc(db, "veterinarios", uid);
      const veterinarioSnap = await getDoc(veterinarioRef);
      if (veterinarioSnap.exists()) {
        const veterinario = veterinarioSnap.data();
        setLoading(false);
        if (veterinario.perfilCompleto) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "AppMain",
              },
            ],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "CompleteProfile",
              },
            ],
          });
        }
      }
    } else {
      Alert.alert(
        "Verificacion",
        "Su cuenta aun no ha sido verificada, revise su correo electronico"
      );
      signOut(auth);
      setLoading(false);
    }
  };

  useEffect(() => {
    //Check is exist user log in app when component are rendered the first time
    if (auth.currentUser) {
      setLoading(true);
      //Check veterinario document
      getVeterinarioDoc(auth.currentUser.uid);
    }
  }, []);

  const erroresLogin = (errores) => {
    const defecto = "Ocurrio un error";
    const listaErrores = {
      "auth/invalid-email":
        "El correo ingresado no es valido, intente de nuevo",
      "auth/user-not-found":
        "El correo ingresado no tiene ninguna cuenta asociada",
      "auth/wrong-password": "La contraseña ingresada no es valida",
      "auth/user-disabled":
        "Su cuenta esta deshabilitada, por favor contactenos",
      "auth/too-many-requests": "Muchas peticiones, por favor espere",
    };
    return listaErrores[errores] ?? defecto;
  };

  const sendRegister = () => {
    navigation.navigate("Register");
  };

  const sendReset = () => {
    navigation.navigate("ResetPassword");
  };

  const login = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user);
        getVeterinarioDoc(user.uid);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Error", erroresLogin(error.code));
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={headerHeight}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <NativeBaseProvider>
        <ScrollView>
          {loading ? (
            <ActivityIndicator
              style={styles.indicador}
              size="large"
              color="rgba(117, 140, 255, 1)"
            />
          ) : null}
          <Box
            mt={8}
            flex={1}
            p={1}
            style={loading ? { opacity: 0.5 } : { opacity: 1 }}
          >
            <Heading
              alignSelf={"center"}
              size="lg"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
            >
              Bienvenido
            </Heading>
            <Heading
              mt="1"
              _dark={{
                color: "warmGray.200",
              }}
              color="coolGray.600"
              fontWeight="medium"
              size="xs"
              alignSelf={"center"}
            >
              ¡Inicia sesión para continuar!
            </Heading>
            <View style={{ alignItems: "center" }} mt={5}>
              <Image
                style={{
                  resizeMode: "contain",
                  aspectRatio: 1,
                }}
                alt="Logo"
                source={require("../../../assets/Logo.png")}
              />
            </View>
            <VStack style={{ marginHorizontal: 5 }} space={3} mt="5">
              <FormControl>
                <FormControl.Label>Correo Electronico</FormControl.Label>
                <Input
                  style={{ fontSize: 15 }}
                  keyboardType="email-address"
                  placeholder="example@example.com"
                  value={email}
                  InputLeftElement={
                    <Icon
                      as={<MaterialCommunityIcons name="account" />}
                      size={5}
                      ml="2"
                      color="muted.400"
                    />
                  }
                  onChangeText={(e) => setEmail(e)}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>Contraseña</FormControl.Label>
                <Input
                  style={{ fontSize: 15 }}
                  placeholder="Escriba su contraseña"
                  value={password}
                  onChangeText={(e) => setPassword(e)}
                  type={show ? "text" : "password"}
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
                            name={show ? "eye-outline" : "eye-off-outline"}
                          />
                        }
                        size={5}
                        mr="2"
                        color="muted.400"
                      />
                    </Pressable>
                  }
                />
                <Link
                  _text={{
                    fontSize: "xs",
                    fontWeight: "500",
                    color: "indigo.500",
                  }}
                  alignSelf="flex-end"
                  mt="1"
                  onPress={sendReset}
                >
                  ¿Olvido la contraseña?
                </Link>
              </FormControl>
              <Ionicons.Button
                disabled={loading ? true : false}
                backgroundColor={"rgba(117, 140, 255, 1)"}
                size={22}
                onPress={login}
                style={{
                  alignSelf: "stretch",
                  justifyContent: "center",
                }}
                name="log-in-outline"
                _disabled={styles.botonDisabled}
              >
                Iniciar sesion
              </Ionicons.Button>
              <HStack mt="6" justifyContent="center">
                <Text
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  Soy un nuevo usuario.{" "}
                </Text>
                <Link
                  _text={{
                    color: "indigo.500",
                    fontWeight: "medium",
                    fontSize: "sm",
                  }}
                  onPress={sendRegister}
                >
                  Registrarse
                </Link>
              </HStack>
            </VStack>
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
