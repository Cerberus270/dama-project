import { Text, StyleSheet, Alert } from "react-native";
import React from "react";
import {
  NativeBaseProvider,
  Box,
  Image,
  View,
  Heading,
  ScrollView,
  VStack,
  HStack,
  Icon,
  Divider,
} from "native-base";
import { useState } from "react";
import { useEffect } from "react";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { ListItem,Avatar } from "react-native-elements";

export default function Home({ navigation }) {
  const [veterinario, setVeterinario] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const unsuscribe = onSnapshot(
        doc(db, "veterinarios", auth.currentUser.uid),
        (doc) => {
          if (doc.exists()) {
            setVeterinario(doc.data());
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
      };
    }, [])
  );

  return (
    <NativeBaseProvider>
      {veterinario ? (
        <ScrollView>
          <Box flex={1} p={1} mb={5}>
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
              Bienvenido
            </Heading>
            <Heading
              mt={1}
              size="md"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
              fontWeight="light"
              alignSelf="center"
            >
              {veterinario
                ? (veterinario.sexo === "Masculino" ? "Dr. " : "Dra. ") +
                  veterinario.nombres +
                  " " +
                  veterinario.apellidos
                : null}
            </Heading>
            <View style={{ alignItems: "center" }} mt={5}>
              <Image
                style={{
                  resizeMode: "contain",
                  aspectRatio: 1,
                }}
                alt="Logo"
                source={require("../../assets/Logo.png")}
              />
            </View>
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
              Disfruta de VETPLUS
            </Heading>

            <Heading
              style={{ flex: 1, textAlign: "center" }}
              mt={1}
              mb={5}
              size="md"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
              fontWeight="semibold"
              alignSelf="center"
            >
              Conoce los beneficios para ti y los pacientes de{" "}
              {veterinario ? veterinario.clinica.nombre : "Tu clinica"}
            </Heading>
            <View m={2}>
              <ListItem style={{marginBottom:5}}>
              <Avatar source={require("../../assets/veterinario.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Gestion de pacientes</Text>
                  </ListItem.Title>
                  <Text>Registra y gestiona a todos tus pacientes de forma rapida y sencilla</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem style={{marginBottom:5}}>
              <Avatar source={require("../../assets/vacuna.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Control de vacunacion</Text>
                  </ListItem.Title>
                  <Text>Acceso rapido y sencillo al historial de vacunacion de tus pacientes</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem style={{marginBottom:5}}>
              <Avatar source={require("../../assets/plato-de-perro.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Control de desparasitacion</Text>
                  </ListItem.Title>
                  <Text>Acceso rapido y sencillo al historial de desparasitacion de tus pacientes</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem style={{marginBottom:5}}>
              <Avatar source={require("../../assets/chequeo-medico.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Historial de atenciones</Text>
                  </ListItem.Title>
                  <Text>Accede al historial de atenciones brindadas a tus pacientes, ademas de registrar nuevas atenciones</Text>
                </ListItem.Content>
              </ListItem>
            </View>
          </Box>
        </ScrollView>
      ) : (
        <ActivityIndicator
          style={styles.indicador}
          size="large"
          color="rgba(117, 140, 255, 1)"
        />
      )}
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
