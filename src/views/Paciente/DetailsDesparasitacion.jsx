import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, Alert } from "react-native";
import {
  NativeBaseProvider,
  Box,
  View,
  ScrollView,
  Heading,
  HStack,
  Divider,
} from "native-base";
import { ListItem, Avatar } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../config/firebase";

export default function DetailsDesparasitacion({ navigation, route }) {
  const { idPaciente } = route.params;
  const { id } = route.params.desparasitante;
  const [desparasitacion, setDesparasitacion] = useState(null);
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

  const avatarSexo = (sexoPaciente) => {
    const avatar = {
      Macho: require("../../../assets/gender-macho.png"),
      Hembra: require("../../../assets/gender-hembra.png"),
    };
    return avatar[sexoPaciente];
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const unsuscribe = onSnapshot(doc(db, "patients", idPaciente, "desparasitacion", id), (desparasitacionF) => {
        if (desparasitacionF.exists()) {
          setLoading(false);
          let desparasitacionDoc = desparasitacionF.data();
          console.log("Hola: ", desparasitacionDoc)
          desparasitacionDoc.fecha = new Date(
            desparasitacionDoc.fecha.toDate()
          );
          desparasitacionDoc.proximaDosis = new Date(
            desparasitacionDoc.proximaDosis.toDate()
          );
          setDesparasitacion(desparasitacionDoc);
          console.log(desparasitacionDoc)
        } else {
          setLoading(false);
          Alert.alert(
            "Error",
            "No hemos podido localizar el perfil del desparasitacion",
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
      });
      return () => {
        unsuscribe();
        setDesparasitacion(null);
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
      {desparasitacion ? (
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
                      size="lg"
                      alignSelf="center"
                      flex={1}
                    >
                      Desparasitante: {desparasitacion.marca}
                    </Heading>
                  </ListItem.Title>
                </ListItem.Content>
                <Avatar
                  source={require("../../../assets/atenciones-tipo/vaccine.png")}
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
                    <Text>Fecha de Desparasitación</Text>
                  </ListItem.Title>
                  <Text>{desparasitacion.fecha.toLocaleDateString("es")}</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem>
                <Avatar source={require("../../../assets/chequeo-medico.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Fecha próxima Dosis</Text>
                  </ListItem.Title>
                  <Text>
                    {desparasitacion.proximaDosis.toLocaleDateString("es")}
                  </Text>
                </ListItem.Content>
              </ListItem>
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
