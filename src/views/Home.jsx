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
import { doc, getDoc } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function Home() {
  const [veterinario, setVeterinario] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const getVeterinario = async (uid) => {
        try {
          const veterinarioRef = doc(db, "veterinarios", uid);
          const veterinarioSnap = await getDoc(veterinarioRef);
          if (veterinarioSnap.exists()) {
            const veterinario = await veterinarioSnap.data();
            setVeterinario(veterinario);
          }
        } catch (error) {
          Alert.alert("Error", error.toString());
        }
      };
      getVeterinario(auth.currentUser.uid)

      return()=>{
        setVeterinario(null);
      }
    }, [])
  );

  return (
    <NativeBaseProvider>
      {veterinario ? (
        <ScrollView>
          <Box flex={1} p={1}>
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
                ? veterinario.nombres + " " + veterinario.apellidos
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
