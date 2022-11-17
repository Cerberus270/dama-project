import { Text, View, ScrollView, StyleSheet, Alert } from "react-native";
import React, { Component, useDebugValue, useEffect, useState } from "react";
import { NativeBaseProvider, Heading, Box } from "native-base";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { db, auth } from "../../../config/firebase";
import { ListItem, Button, Avatar, Badge } from "react-native-elements";
import { Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

export default function ListPacientes({ navigation }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const actualizarEmpleado = (paciente) => {
    // AQUI VA EL DE ACTUALIZAR
    //navigation.navigate('DetailsPaciente');
    console.log("Hola", paciente);
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const q = query(
        collection(db, "patients"),
        where("veterinario", "==", auth.currentUser.uid)
      );

      const unsuscribe = onSnapshot(q, (pacientes) => {
        let listaPacientes = [];
        pacientes.forEach((paciente) => {
          const {
            fechaNacimiento,
            fechaRegistro,
            nombre,
            peso,
            propietario,
            raza,
            sexo,
            tipo,
            veterinario,
          } = paciente.data();
          listaPacientes.push({
            id: paciente.id,
            fechaNacimiento,
            fechaRegistro,
            nombre,
            peso,
            propietario,
            raza,
            sexo,
            tipo,
            veterinario,
          });
        });
        setLoading(false);
        setPacientes(listaPacientes);
      });

      return () => {
        unsuscribe();
        setLoading(false);
        setPacientes([]);
      };
    }, [])
  );

  return (
    <NativeBaseProvider>
      {loading ? (
        <ActivityIndicator
          style={styles.indicador}
          size="large"
          color="rgba(117, 140, 255, 1)"
        />
      ) : (
        <ScrollView>
          <Box m={2} flex={1} p={1}>
            <Heading
              size="lg"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
              fontWeight="bold"
              alignSelf="center"
              mb={2}
            >
              Mis pacientes
            </Heading>
            <View style={styles.container}>
              {pacientes.map((paciente) => {
                return (
                  <ListItem.Swipeable
                    key={paciente.id}
                    bottomDivider
                    onPress={() => {
                      navigation.navigate("TabPaciente", paciente);
                    }}
                    rightContent={
                      <Button
                        title="Actualizar"
                        onPress={() => {
                          actualizarEmpleado(paciente);
                        }}
                        icon={{ name: "info", color: "white" }}
                        buttonStyle={{ minHeight: "100%" }}
                      />
                    }
                  >
                    <Avatar source={avatarPic(paciente.tipo)} />
                    <ListItem.Content>
                      <ListItem.Title>
                        <Text >{paciente.id}</Text>
                      </ListItem.Title>
                      <View>
                        <Text style={styles.ratingText}>Nombre Paciente: {paciente.nombre}</Text>
                        <Text style={styles.ratingText}>
                          Nombre Propietario: {paciente.propietario.nombre}
                        </Text>
                        <Text style={styles.ratingText}>
                          Tipo: {paciente.tipo}
                        </Text>
                        <Text style={styles.ratingText}>
                          Raza: {paciente.raza}
                        </Text>
                      </View>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem.Swipeable>
                );
              })}
            </View>
          </Box>
        </ScrollView>
      )}
    </NativeBaseProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 30,
    textAlign: "center",
  },
  subtitleView: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 5,
  },
  ratingText: {
    paddingLeft: 10,
    color: "grey",
  },
  nombrePropietario: {
    paddingLeft: 10,
    color: "black",
  },
  btn1: {
    backgroundColor: "orange",
    padding: 10,
    margin: 10,
    width: "95%",
  },
  btn2: {
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
    width: "95%",
  },
  btn3: {
    backgroundColor: "rgb(77, 103, 145)",
    padding: 10,
    margin: 10,
    width: "95%",
  },
  pageName: {
    margin: 10,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  indicador: {
    position: "absolute",
    top: "50%",
    left: "25%",
    right: "25%",
  },
});
