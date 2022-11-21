import React, { useState } from "react";
import { StyleSheet as StyleSheetReact } from "react-native";
import {
  NativeBaseProvider,
  VStack,
  Box,
  Divider,
  Button as ButtonNative,
  Text,
  View,
  Heading,
  Icon,
  ScrollView,
} from "native-base";
import { ListItem, Button, SpeedDial } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ActivityIndicator } from "react-native";
import { Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo } from "@expo/vector-icons";

export default function Vacunas({ navigation, route }) {
  const { id } = route.params;
  const [vacunas, setVacunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const actualizarVacuna = (vacuna) => {
    navigation.navigate('UpdateVacuna',{vacuna, idPaciente: id});
  };

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
            const { dosis, fecha, marca, nombre, peso, proximaDosis, tipo } =
              doc.data();
            listaVacuna.push({
              id: doc.id,
              dosis,
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
        setLoading(true);
        setVacunas([]);
      };
    }, [])
  );

  return (
    <NativeBaseProvider>
      <MenuProvider style={styles.containerMenu}>
        {loading ? (
          <ActivityIndicator
            style={styles.indicador}
            size="large"
            color="rgba(117, 140, 255, 1)"
          />
        ) : (
          <Box flex={1} p={1} w="95%" mx="auto">
            {uploading ? (
              <ActivityIndicator
                style={styles.indicador}
                size="large"
                color="rgba(117, 140, 255, 1)"
              />
            ) : null}
            <VStack mt={15} mb={15} space={2} px="2">
              <Heading size="md" marginY={1} bold alignSelf={'center'}>Menu Vacunas</Heading>
              <ButtonNative leftIcon={<Icon as={FontAwesome5} name="syringe" size="sm" color={"white"} />}
                backgroundColor={"rgba(117, 140, 255, 1)"}
                size="lg"
                variant="outline"
                onPress={() => {
                  navigation.navigate("CreateVacunas", route.params);
                }}
              >
                <Text style={{ color: "white" }}>Agregar Nueva Vacuna</Text>
              </ButtonNative>

              <Divider my={4} />
              <ScrollView>
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
                          navigation.navigate("DetailsVacuna", { vacuna, idPaciente: id })
                        }}
                        rightContent={
                          <Button
                              title="Actualizar"
                              onPress={() => {
                                actualizarVacuna(vacuna);
                                }}
                              icon={{ name: 'update', color: 'white' }}
                              buttonStyle={{ minHeight: '100%' }}
                          />
                        }
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
                        }>
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
              </ScrollView>
            </VStack>
          </Box>
        )}
      </MenuProvider>
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
  containerMenu: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  }
});