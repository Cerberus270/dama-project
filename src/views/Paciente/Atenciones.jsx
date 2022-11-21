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
import { ListItem, Button, Avatar } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  deleteDoc,
  onSnapshot,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ActivityIndicator } from "react-native";
import { Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { timestampToDate } from "../../../utils/utils";

export default function Atenciones({ navigation, route }) {
  const { id } = route.params;

  console.log(id);

  const [atenciones, setAtenciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const atencionPic = (typePaciente) => {
    const atencion = {
      Rutinaria: require("../../../assets/atenciones-tipo/veterinary.png"),
      Emergencia: require("../../../assets/atenciones-tipo/rescue.png"),
      Grooming: require("../../../assets/atenciones-tipo/dog.png"),
    };
    return atencion[typePaciente];
  };

  const deleteAtencion = (idVacuna) => {
    setUploading(true);
    deleteDoc(doc(db, "patients", id, "atenciones", idVacuna))
      .then((result) => {
        setUploading(false);
        Alert.alert("Exito", "La atencion fue eliminada exitosamente");
      })
      .catch((error) => {
        setUploading(false);
        Alert.alert(
          "Error",
          "Ocurrio un error al intentar eliminar la atencion"
        );
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const q = query(
        collection(db, "atenciones"),
        where("paciente", "==", id)
      );
      const unsuscribe = onSnapshot(q, (atenciones) => {
        let listadoAtenciones = [];
        atenciones.forEach((doc) => {
          console.log(doc.data());
          const { descripcion, fecha, proximaCita, tipo } = doc.data();
          listadoAtenciones.push({
            id: doc.id,
            descripcion,
            fecha,
            proximaCita,
            tipo,
          });
        });
        setLoading(false);
        setAtenciones(listadoAtenciones);
      });

      return () => {
        unsuscribe();
        setLoading(true);
        setAtenciones([]);
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
              <Heading size="md" marginY={1} bold alignSelf={"center"}>
                Menu Atenciones
              </Heading>
              <ButtonNative
                leftIcon={
                  <Icon
                    as={FontAwesome5}
                    name="syringe"
                    size="sm"
                    color={"white"}
                  />
                }
                backgroundColor={"rgba(117, 140, 255, 1)"}
                size="lg"
                variant="outline"
                onPress={() => {
                  navigation.navigate("CreateAtenciones", route.params);
                }}
              >
                <Text style={{ color: "white" }}>Agregar Nueva Atencion</Text>
              </ButtonNative>

              <Divider my={4} />
              {atenciones.length === 0 ? (
                <View style={{ alignSelf: "center" }}>
                  <Text style={{ alignSelf: "center" }}>
                    El paciente no presenta atenciones.
                  </Text>
                  <Text style={{ alignSelf: "center" }} bold>
                    Recuerdele al dueño la importancia de las atenciones
                  </Text>
                </View>
              ) : (
                atenciones.map((atencion) => {
                  return (
                    <ListItem
                      key={atencion.id}
                      bottomDivider
                      onPress={() => {
                        navigation.navigate("DetailsAtencion", atencion);
                      }}
                    >
                      <Avatar source={atencionPic(atencion.tipo)} />
                      <ListItem.Content>
                        <ListItem.Title>
                          <Text>Tipo de Atencion: {atencion.tipo}</Text>
                        </ListItem.Title>
                        <View>
                          <Text style={styles.ratingText}>
                            Fecha Atencion:{" "}
                            {timestampToDate(atencion.fecha.seconds)}
                          </Text>
                        </View>
                      </ListItem.Content>
                      <ListItem.Chevron />
                    </ListItem>
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
