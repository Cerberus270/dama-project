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

export default function DetailsPaciente({ navigation, route }) {
  const { id } = route.params;
  const [paciente, setPaciente] = useState(null);
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
      const unsuscribe = onSnapshot(doc(db, "patients", id), (paciente) => {
        if (paciente.exists()) {
          setLoading(false);
          let pacienteDoc = paciente.data();
          pacienteDoc.fechaNacimiento = new Date(
            pacienteDoc.fechaNacimiento.toDate()
          );
          pacienteDoc.fechaRegistro = new Date(
            pacienteDoc.fechaRegistro.toDate()
          );
          setPaciente(pacienteDoc);
        } else {
          setLoading(false);
          Alert.alert(
            "Error",
            "No hemos podido localizar el perfil del paciente",
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
        setPaciente(null);
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
      {paciente ? (
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
                      {paciente.nombre}
                    </Heading>
                  </ListItem.Title>
                </ListItem.Content>
                <Avatar
                  source={require("../../../assets/dog-collar.png")}
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
                    <Text>Fecha registro en clinica</Text>
                  </ListItem.Title>
                  <Text>{paciente.fechaRegistro.toLocaleDateString("es")}</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem>
                <Avatar source={require("../../../assets/pata.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Fecha nacimiento</Text>
                  </ListItem.Title>
                  <Text>
                    {paciente.fechaNacimiento.toLocaleDateString("es")}
                  </Text>
                </ListItem.Content>
              </ListItem>
              <ListItem>
                <Avatar source={avatarPic(paciente.tipo)} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Tipo</Text>
                  </ListItem.Title>
                  <Text>{paciente.tipo}</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem>
                <Avatar source={require("../../../assets/pets-allowed.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Raza</Text>
                  </ListItem.Title>
                  <Text>{paciente.raza}</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem>
                <Avatar source={avatarSexo(paciente.sexo)} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Sexo</Text>
                  </ListItem.Title>
                  <Text>{paciente.sexo}</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem>
                <Avatar source={require("../../../assets/weight.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Peso</Text>
                  </ListItem.Title>
                  <Text>{paciente.peso} Lb</Text>
                </ListItem.Content>
              </ListItem>
              <Divider />
              <ListItem>
                <Avatar source={require("../../../assets/owner.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Nombre propietario</Text>
                  </ListItem.Title>
                  <Text>{paciente.propietario.nombre}</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem>
                <Avatar source={require("../../../assets/call.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Telefono propietario</Text>
                  </ListItem.Title>
                  <Text>{paciente.propietario.telefono}</Text>
                </ListItem.Content>
              </ListItem>
              <ListItem>
                <Avatar source={require("../../../assets/pet-shop.png")} />
                <ListItem.Content>
                  <ListItem.Title>
                    <Text>Direccion propietario</Text>
                  </ListItem.Title>
                  <Text>{paciente.propietario.direccion}</Text>
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
