import { Text } from "react-native";
import React, { useState } from "react";
import {
  NativeBaseProvider,
  ScrollView,
  Box,
  View,
  Heading,
  Divider,
} from "native-base";
import { ListItem, Button, Avatar } from "react-native-elements";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "../../../config/firebase";
import { onSnapshot, doc, collection } from "firebase/firestore";

export default function DetailsAtencion({ navigation, route }) {
  const { id } = route.params;
  const [atencion, setAtencion] = useState(null);
  const [detallesReceta, setDetallesReceta] = useState([]);
  const [loading, setLoading] = useState(false);

  const productoTipoAvatar = (productoTipo) => {
    const avatar = {
      Desparasitante: require("../../../assets/medicine.png"),
      Vacuna: require("../../../assets/vacuna.png"),
      Suplemento: require("../../../assets/pet-food.png"),
      Antibiotico: require("../../../assets/antibiotic.png"),
      Antiinflamatorio: require("../../../assets/bandage.png"),
      Estetica: require("../../../assets/pet-shampoo.png"),
    };
    return avatar[productoTipo];
  };

  const atencionPic = (atencionTipo) => {
    const atencion = {
      Rutinaria: require("../../../assets/atenciones-tipo/veterinary.png"),
      Emergencia: require("../../../assets/atenciones-tipo/rescue.png"),
      Grooming: require("../../../assets/atenciones-tipo/dog.png"),
    };
    return atencion[atencionTipo];
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const unsuscribe = onSnapshot(
        doc(db, "atenciones", id),
        (atencionDoc) => {
          if (atencionDoc.exists()) {
            setLoading(false);
            const atencion = atencionDoc.data();
            atencion.fecha = new Date(atencion.fecha.toDate());
            atencion.proximaCita = new Date(atencion.proximaCita.toDate());
            setAtencion(atencion);
          } else {
            setLoading(false);
            Alert.alert(
              "Error",
              "No hemos podido localizar la atencion seleccionada",
              [
                {
                  text: "Aceptar",
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ]
            );
          }
        }
      );

      const unsuscribeReceta = onSnapshot(
        collection(db, "atenciones", id, "receta"),
        (detalles) => {
          setLoading(true);
          let listaDetalles = [];
          detalles.forEach((doc) => {
            listaDetalles.push(doc.data());
          });
          setLoading(false);
          setDetallesReceta(listaDetalles);
        }
      );
      return () => {
        unsuscribe();
        unsuscribeReceta();
        setAtencion(null);
        setDetallesReceta([]);
        setLoading(true);
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
      ) : null}
      {atencion ? (
        <ScrollView>
          <Box style={{ marginHorizontal: 5 }} mt={5} mb={5} flex={1} p={1}>
            <View m={2}>
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title
                    style={{ textAlign: "center", alignSelf: "center" }}
                  >
                    <Heading
                      textAlign={"center"}
                      size="xl"
                      alignSelf="center"
                      flex={1}
                    >
                      {atencion.tipo}
                    </Heading>
                  </ListItem.Title>
                </ListItem.Content>
                <Avatar
                  source={atencionPic(atencion.tipo)}
                  size="large"
                  justifyContent="center"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <Avatar
                  source={require("../../../assets/chequeo-medico.png")}
                />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Fecha de atencion</Text>
                  </ListItem.Title>
                  <Text>{atencion.fecha.toLocaleDateString("es")}</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem>
                <Avatar
                  source={require("../../../assets/medical-report.png")}
                />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Diagnostico</Text>
                  </ListItem.Title>
                  <Text>{atencion.descripcion}</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem>
                <Avatar source={require("../../../assets/next-week.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Fecha proxima atencion</Text>
                  </ListItem.Title>
                  <Text>{atencion.proximaCita.toLocaleDateString("es")}</Text>
                </ListItem.Content>
              </ListItem>
              <Divider />
              {detallesReceta.length === 0 ? (
                <ListItem>
                  <ListItem.Content>
                    <ListItem.Title
                      style={{ textAlign: "center", alignSelf: "center" }}
                    >
                      <Heading
                        textAlign={"center"}
                        size="lg"
                        alignSelf="center"
                        flex={1}
                      >
                        Esta atencion no posee receta
                      </Heading>
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              ) : (
                <ListItem>
                  <ListItem.Content>
                    <ListItem.Title
                      style={{ textAlign: "center", alignSelf: "center" }}
                    >
                      <Heading
                        textAlign={"center"}
                        size="lg"
                        alignSelf="center"
                        flex={1}
                      >
                        Receta
                      </Heading>
                    </ListItem.Title>
                  </ListItem.Content>
                  <Avatar
                    source={require("../../../assets/prescription.png")}
                    size="medium"
                    justifyContent="center"
                  />
                </ListItem>
              )}
              {detallesReceta.map((detalle, index) => {
                return (
                  <ListItem key={index} bottomDivider={true}>
                    <Avatar source={productoTipoAvatar(detalle.tipo)} />
                    <ListItem.Content>
                      <ListItem.Title>
                        <Text>{detalle.nombreProducto}</Text>
                      </ListItem.Title>
                      <View>
                        <Text style={styles.ratingText}>
                          {detalle.marcaProducto}
                        </Text>
                        <Text style={styles.ratingText}>
                          {detalle.indicaciones}
                        </Text>
                      </View>
                    </ListItem.Content>
                  </ListItem>
                );
              })}
            </View>
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
