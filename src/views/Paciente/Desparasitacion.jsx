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
    ScrollView,
    Icon,
    Heading
} from "native-base";
import { ListItem, Button } from "react-native-elements";
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

export default function Desparasitacion({ navigation, route }) {
    const { id } = route.params;
    const [desparasitacion, setDesparasitacion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const timestampToDate = (valorTimestamp) => {
        return new Date(valorTimestamp * 1000).toLocaleDateString("en-US")
    };

    const actualizarDesparasitacion = (desparasitacion) => {
        // AQUI VA EL DE ACTUALIZAR
        navigation.navigate('UpdateDesparasitacion', desparasitacion);
        
      };

    const deleteDesparasitante = (idDesparasitante) => {
        setUploading(true);
        deleteDoc(doc(db, "patients", id, "desparasitacion", idDesparasitante))
            .then((result) => {
                setUploading(false);
                Alert.alert("Exito", "La Desparasitación fue eliminada exitosamente");
            })
            .catch((error) => {
                setUploading(false);
                Alert.alert("Error", "Ocurrio un error al intentar eliminar la Desparasitación");
            });
    };

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            const unsuscribe = onSnapshot(
                collection(db, "patients", id, "desparasitacion"),
                (desparasitacion) => {
                    let listaDesparasitaciones = [];
                    desparasitacion.forEach((doc) => {
                        console.log(doc.data());
                        const { fecha, marca, proximaDosis } =
                            doc.data();
                        listaDesparasitaciones.push({
                            id: doc.id,
                            fecha, marca, proximaDosis
                        });
                    });
                    setLoading(false);
                    setDesparasitacion(listaDesparasitaciones);
                }
            );

            return () => {
                unsuscribe();
<<<<<<< HEAD
                setLoading(false);
                setDesparasitacion([]);
=======
                setLoading(true);
                setVacunas([]);
>>>>>>> f87899462d620f82baf210b1f31e7bc324e09c6d
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
                            <Heading size="md" marginY={1} bold alignSelf={'center'}>Menu Desparasitación</Heading>
                            <ButtonNative leftIcon={<Icon as={FontAwesome5} name="bacteria" size="sm" color={"white"} />}
                                backgroundColor={"rgba(117, 140, 255, 1)"}
                                size="lg"
                                variant="outline"
                                onPress={() => {
                                    navigation.navigate("CreateDesparasitacion", route.params);
                                }}
                            >
                                <Text style={{ color: "white" }}>Agregar Nueva Desparasitación</Text>
                            </ButtonNative>

                            <Divider my={4} />
                            {desparasitacion.length === 0 ? (
                                <View style={{ alignSelf: "center" }}>
                                    <Text style={{ alignSelf: "center" }}>
                                        El paciente no presenta desparasitación.
                                    </Text>
                                    <Text style={{ alignSelf: "center" }} bold>
                                        Recuerdele al dueño la importancia de la desparasitación
                                    </Text>
                                </View>
                            ) : (
                                desparasitacion.map((desparasitante) => {
                                    return (
                                        <ListItem.Swipeable
                                            key={desparasitante.id}
                                            bottomDivider
                                            onPress={() => {
                                                console.log("Detalles");
                                            }}
                                            rightContent={
                                                <Button
                                                title="Actualizar"
                                                onPress={() => {
                                                actualizarDesparasitacion(desparasitacion);
                                                }}
                                                icon={{ name: "update", color: "white" }}
                                                buttonStyle={{ minHeight: "100%" }}
                                            />
                                            }
                                            leftContent={
                                                <Button
                                                    disabled={uploading ? true : false}
                                                    title="Eliminar"
                                                    onPress={() => {
                                                        Alert.alert(
                                                            "Confirmación",
                                                            "¿Desea eliminar la desparasitación seleccionada?",
                                                            [
                                                                {
                                                                    text: "Eliminar",
                                                                    onPress: () => {
                                                                        deleteDesparasitante(desparasitante.id);
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
                                                    <Text>Marca: {desparasitante.marca}</Text>
                                                </ListItem.Title>
                                                <View>
                                                    <Text style={styles.ratingText}>
                                                        Fecha Aplicación: {timestampToDate(desparasitante.fecha.seconds)}
                                                    </Text>
                                                    <Text style={styles.ratingText}>
                                                        Próxima Dosis: {timestampToDate(desparasitante.proximaDosis.seconds)}
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
