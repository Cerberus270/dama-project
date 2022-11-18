import React, { useEffect, useState } from "react";
import { StyleSheet as StyleSheetReact } from "react-native";
import {
  NativeBaseProvider,
  VStack,
  HStack,
  ZStack,
  Stack,
  Center,
  Box,
  Heading,
  Divider,
  StyleSheet,
  Button as ButtonNative,
  Text,
  View,
  ScrollView,
  FormControl,
  InputGroup,
  InputLeftAddon,
  WarningOutlineIcon,
  Input,
  Spacer,
} from "native-base";
import { ListItem, Button, Avatar, Badge } from "react-native-elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../../config/firebase";
import { ActivityIndicator } from "react-native";
import { Alert } from "react-native";

export default function Vacunas({ navigation, route }) {
  const { id } = route.params;
  const [vacunas, setVacunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const deleteVacuna = (idVacuna) => {
    setUploading(true);
    deleteDoc(doc(db, "patients", id, "vacunas", idVacuna))
      .then((result) => {
        setUploading(false);
        Alert.alert("Exito", "La vacuna fue eliminada exitosamente");
      })
      .catch((error) => {
        setUploading(false);
        Alert.alert("Error", "Ocurrio un error al intentar eliminar la vacuna");
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const unsuscribe = onSnapshot(
        collection(db, "patients", id, "vacunas"),
        (vacunas) => {
          let listaVacuna = [];
          vacunas.forEach((doc) => {
            console.log(doc.data());
            const { dosis, fecha, marca, nombre, peso, proximaDosis, tipo } =
              doc.data();
            listaVacuna.push({
              id: doc.id,
              fecha,
              marca,
              nombre,
              peso,
              proximaDosis,
              tipo,
            });
          });
          setLoading(false);
          setVacunas(listaVacuna);
        }
      );

      return () => {
        unsuscribe();
        setLoading(false);
        setVacunas([]);
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
        <ScrollView style={uploading ? { opacity: 0.5 } : { opacity: 1 }}>
          {uploading ? (
            <ActivityIndicator
              style={styles.indicador}
              size="large"
              color="rgba(117, 140, 255, 1)"
            />
          ) : null}
          <Box flex={1} p={1} w="95%" mx="auto">
            <VStack mt={15} mb={15} space={2} px="2">
              <ButtonNative
                backgroundColor={"rgba(117, 140, 255, 1)"}
                size="lg"
                variant="outline"
                onPress={() => {
                  navigation.navigate("CreateVacunas");
                }}
              >
                <Text style={{ color: "white" }}>Agregar Nueva Vacuna</Text>
              </ButtonNative>

              <Divider my={4} />
              {vacunas.length === 0 ? (
                <View style={{ alignSelf: "center" }}>
                  <Text style={{ alignSelf: "center" }}>
                    El paciente no presenta vacunas.
                  </Text>
                  <Text style={{ alignSelf: "center" }} bold>
                    Recuerdele al dueño la importancia de las vacunas
                  </Text>
                </View>
              ) : (
                vacunas.map((vacuna) => {
                  return (
                    <ListItem.Swipeable
                      key={vacuna.id}
                      bottomDivider
                      onPress={() => {
                        console.log("Detalles");
                      }}
                      leftContent={
                        <Button
                          disabled={uploading ? true : false}
                          title="Eliminar"
                          onPress={() => {
                            Alert.alert(
                              "Confirmacion",
                              "Desea eliminar la vacuna seleccionada?",
                              [
                                {
                                  text: "Eliminar",
                                  onPress: () => {
                                    deleteVacuna(vacuna.id);
                                  },
                                },
                                {
                                  text: "Cancelar",
                                },
                              ]
                            );
                          }}
                          icon={{ name: "delete", color: "white" }}
                          buttonStyle={{
                            minHeight: "100%",
                            backgroundColor: "red",
                          }}
                        />
                      }
                    >
                      <ListItem.Content>
                        <ListItem.Title>
                          <Text>Nombre Vacuna: {vacuna.nombre}</Text>
                        </ListItem.Title>
                        <View>
                          <Text style={styles.ratingText}>
                            Marca Vacuna: {vacuna.marca}
                          </Text>
                          <Text style={styles.ratingText}>
                            Tipo Vacuna: {vacuna.tipo}
                          </Text>
                        </View>
                      </ListItem.Content>
                      <ListItem.Chevron />
                    </ListItem.Swipeable>
                  );
                })
              )}
            </VStack>
          </Box>
        </ScrollView>
      )}
    </NativeBaseProvider>
  );
}

const styles = StyleSheetReact.create({
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
