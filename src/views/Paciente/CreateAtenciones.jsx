import React, { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView } from "react-native";
// Components Imports
import {
  NativeBaseProvider,
  ScrollView,
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Text,
  Button,
  View,
  WarningOutlineIcon,
  Icon,
  HStack,
  Select,
  CheckIcon,
  Modal,
} from "native-base";
import { useFocusEffect } from "@react-navigation/native";
// Validation Imports
import * as yup from "yup";
import { Formik } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// Other Components
// Firebase Auth and Firestore
import { auth, db } from "../../../config/firebase";
import { addDoc, collection, writeBatch, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ListItem, Button as ButtonElements } from "react-native-elements";
import { ActivityIndicator } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

const CreateAtenciones = ({ navigation, route }) => {
  const { id } = route.params;
  //Date Picker
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [text, setText] = useState("");
  const [proximaCita, setProximaCita] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detallesReceta, setDetallesReceta] = useState([]);
  const [elements, setElements] = useState(0);

  const headerHeight = useHeaderHeight();

  const form = useRef();
  const formDetalles = useRef();

  const fechaProxMin = new Date();
  fechaProxMin.setDate(fechaProxMin.getDate() + 1);

  const formularioValidacion = yup.object().shape({
    tipo: yup.string().required("Elija tipo Atención brindada"),
    descripcion: yup
      .string()
      .min(4, "Minimo 4 caracteres")
      .required("Descripción requerida"),
  });

  const formularioDetalle = yup.object().shape({
    tipo: yup.string().required("Seleccione un tipo de producto"),
    nombreProducto: yup.string().required("Ingrese el nombre del producto"),
    marcaProducto: yup.string().required("Ingrese la marca del producto"),
    indicaciones: yup.string().required("Ingrese las indicaciones de uso"),
  });

  const valoresInicialesDetalles = {
    tipo: "",
    marcaProducto: "",
    nombreProducto: "",
    indicaciones: "",
  };

  const valoresIniciales = {
    tipo: "",
    descripcion: "",
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    if (event.type == "set") {
      let tempDate = new Date(currentDate);
      let fDate =
        (tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()) +
        "/" +
        ((tempDate.getMonth() + 1) < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
      setProximaCita(tempDate);
      setText(fDate);
      console.log(fDate);
    }
  };

  const sendData = (data) => {
    if (text === "") {
      Alert.alert("Deber seleccionar una fecha valida");
    } else {
      Alert.alert(
        "Confirmacion",
        "Por razones de seguridad, una atencion no puede ser modificada o eliminada, desea registrar esta atencion?",
        [
          {
            text: "Aceptar",
            onPress: () => {
              setUploading(true);
              data.fecha = new Date();
              data.proximaCita = proximaCita;
              data.paciente = id;
              addDoc(collection(db, "atenciones"), data)
                .then(async (docRef) => {
                  const batch = writeBatch(db);
                  detallesReceta.forEach((detalle) => {
                    const detalleRef = doc(
                      collection(db, "atenciones", docRef.id, "receta")
                    );
                    batch.set(detalleRef, detalle);
                  });
                  batch
                    .commit()
                    .then((result) => {
                      setUploading(false);
                      Alert.alert(
                        "Exito",
                        "La atencion fue registrada con exito",
                        [
                          {
                            text: "Aceptar",
                            onPress: () => {
                              navigation.goBack();
                            },
                          },
                        ]
                      );
                    })
                    .catch((error) => {
                      setUploading(false);
                      Alert.alert(
                        "Advertencia",
                        "La atencion fue registrada con exito, pero ocurrio un error al registrar la receta",
                        [
                          {
                            text: "Aceptar",
                            onPress: () => {
                              navigation.goBack();
                            },
                          },
                        ]
                      );
                    });
                })
                .catch((error) => {
                  setUploading(false);
                  Alert.alert(
                    "Error",
                    "Ocurrio un error inesperado al registrar la atencion",
                    [
                      {
                        text: "Aceptar",
                        onPress: () => {
                          navigation.goBack();
                        },
                      },
                    ]
                  );
                });
            },
          },
          {
            text: "Cancelar",
          },
        ]
      );
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
    form.reset;
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        form.current?.resetForm();
        setShow(false);
        setText("");
        setUploading(false);
        setElements(0);
        setDetallesReceta([]);
        setModalVisible(false);
      };
    }, [])
  );

  return (
    <NativeBaseProvider>
      {uploading ? (
        <ActivityIndicator
          style={styles.indicador}
          size="large"
          color="rgba(117, 140, 255, 1)"
        />
      ) : null}
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        size={"xl"}
        avoidKeyboard={true}
      >
        <Modal.Content>
          <Modal.CloseButton
            onPress={() => {
              formDetalles.current.resetForm();
              setModalVisible(false);
            }}
          />
          <Modal.Header>Receta para la atencion</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <Box style={{ marginHorizontal: 5 }} flex={1} p={1}>
                <Formik
                  innerRef={formDetalles}
                  initialValues={valoresInicialesDetalles}
                  onSubmit={(values, { resetForm }) => {
                    detallesReceta.push(values);
                    resetForm();
                    setModalVisible(false);
                    setElements(elements + 1);
                  }}
                  validationSchema={formularioDetalle}
                >
                  {({
                    values,
                    handleChange,
                    errors,
                    setFieldTouched,
                    touched,
                    handleSubmit,
                    resetForm,
                  }) => (
                    <View>
                      <VStack space={5}>
                        <FormControl isInvalid={"tipo" in errors}>
                          <FormControl.Label _text={styles.labelInput}>
                            Tipo de producto:
                          </FormControl.Label>
                          <Select
                            minWidth="200"
                            accessibilityLabel="Seleccione tipo de producto"
                            placeholder="Seleccione tipo de producto"
                            onValueChange={handleChange("tipo")}
                            selectedValue={values.tipo}
                            _selectedItem={{
                              bg: "teal.600",
                              endIcon: <CheckIcon size={5} />,
                            }}
                            mt="1"
                          >
                            <Select.Item
                              label="Desparasitante"
                              value="Desparasitante"
                            />
                            <Select.Item label="Vacuna" value="Vacuna" />
                            <Select.Item
                              label="Suplemento"
                              value="Suplemento"
                            />
                            <Select.Item
                              label="Antibiotico"
                              value="Antibiotico"
                            />
                            <Select.Item
                              label="Antiinflamatorio"
                              value="Antiinflamatorio"
                            />
                            <Select.Item label="Estetica" value="Estetica" />
                          </Select>

                          {touched.tipo && errors.tipo && (
                            <FormControl.ErrorMessage
                              leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                              {errors.tipo}
                            </FormControl.ErrorMessage>
                          )}
                        </FormControl>

                        <FormControl isInvalid={"nombreProducto" in errors}>
                          <FormControl.Label _text={styles.labelInput}>
                            Nombre producto:
                          </FormControl.Label>
                          <Input
                            _focus={styles.inputSeleccionado}
                            placeholder="Ingrese el nombre del producto"
                            InputLeftElement={
                              <Icon
                                as={
                                  <MaterialCommunityIcons name="file-edit-outline" />
                                }
                                size={5}
                                ml="2"
                                color="muted.400"
                              />
                            }
                            value={values.nombreProducto}
                            onChangeText={handleChange("nombreProducto")}
                            onBlur={() => setFieldTouched("nombreProducto")}
                          />

                          {touched.nombreProducto && errors.nombreProducto && (
                            <FormControl.ErrorMessage
                              leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                              {errors.nombreProducto}
                            </FormControl.ErrorMessage>
                          )}
                        </FormControl>

                        <FormControl isInvalid={"marcaProducto" in errors}>
                          <FormControl.Label _text={styles.labelInput}>
                            Marca producto:
                          </FormControl.Label>
                          <Input
                            _focus={styles.inputSeleccionado}
                            placeholder="Ingrese la marca del producto"
                            InputLeftElement={
                              <Icon
                                as={
                                  <MaterialCommunityIcons name="registered-trademark" />
                                }
                                size={5}
                                ml="2"
                                color="muted.400"
                              />
                            }
                            value={values.marcaProducto}
                            onChangeText={handleChange("marcaProducto")}
                            onBlur={() => setFieldTouched("marcaProducto")}
                          />

                          {touched.marcaProducto && errors.marcaProducto && (
                            <FormControl.ErrorMessage
                              leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                              {errors.marcaProducto}
                            </FormControl.ErrorMessage>
                          )}
                        </FormControl>

                        <FormControl isInvalid={"indicaciones" in errors}>
                          <FormControl.Label _text={styles.labelInput}>
                            Indicaciones:
                          </FormControl.Label>
                          <Input
                            multiline
                            numberOfLines={4}
                            style={{ height: 80 }}
                            _focus={styles.inputSeleccionado}
                            InputLeftElement={
                              <Icon
                                as={
                                  <MaterialCommunityIcons name="medical-bag" />
                                }
                                size={5}
                                ml="2"
                                color="muted.400"
                              />
                            }
                            value={values.indicaciones}
                            onChangeText={handleChange("indicaciones")}
                            onBlur={() => setFieldTouched("indicaciones")}
                          />
                          {touched.indicaciones && errors.indicaciones && (
                            <FormControl.ErrorMessage
                              leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                              {errors.indicaciones}
                            </FormControl.ErrorMessage>
                          )}
                        </FormControl>

                        <HStack mb={5} space={2} justifyContent="center">
                          <Ionicons.Button
                            backgroundColor={"rgba(117, 140, 255, 1)"}
                            size={22}
                            onPress={handleSubmit}
                            style={{
                              alignSelf: "stretch",
                              justifyContent: "center",
                            }}
                            name="save"
                            _disabled={styles.botonDisabled}
                          >
                            Agregar Detalle
                          </Ionicons.Button>
                          <Ionicons.Button
                            backgroundColor={"rgba(117, 140, 255, 1)"}
                            size={22}
                            onPress={() => {
                              resetForm();
                            }}
                            style={{
                              alignSelf: "stretch",
                              justifyContent: "center",
                            }}
                            name="refresh-outline"
                            _disabled={styles.botonDisabled}
                          >
                            Reestablecer
                          </Ionicons.Button>
                        </HStack>
                      </VStack>
                    </View>
                  )}
                </Formik>
              </Box>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                onPress={() => {
                  setModalVisible(false);
                  formDetalles.current?.resetForm();
                }}
              >
                Cerrar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={headerHeight}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={uploading ? { opacity: 0.5 } : { opacity: 1 }}>
          <Box style={{ marginHorizontal: 5 }} mt={2} flex={1} p={1}>
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
              Registro de Atención
            </Heading>
            <Formik
              innerRef={form}
              initialValues={valoresIniciales}
              onSubmit={(values, { resetForm }) => {
                sendData(values);
              }}
              validationSchema={formularioValidacion}
            >
              {({
                values,
                handleChange,
                errors,
                setFieldTouched,
                touched,
                isValid,
                handleSubmit,
                resetForm,
              }) => (
                <View>
                  <VStack space={4} mt="5">
                    <FormControl isInvalid={"tipo" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Tipo de Atención:
                      </FormControl.Label>
                      <Select
                        fontSize={15}
                        minWidth="200"
                        accessibilityLabel="Seleccione tipo de atencion"
                        placeholder="Seleccione tipo de atencion"
                        onValueChange={handleChange("tipo")}
                        selectedValue={values.tipo}
                        _selectedItem={{
                          bg: "teal.600",
                          endIcon: <CheckIcon size={5} />,
                        }}
                        mt="1"
                      >
                        <Select.Item label="Rutinaria" value="Rutinaria" />
                        <Select.Item label="Emergencia" value="Emergencia" />
                        <Select.Item label="Grooming" value="Grooming" />
                      </Select>

                      {touched.tipo && errors.tipo && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.tipo}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>

                    <FormControl onTouchStart={() => showMode("date")}>
                      <FormControl.Label _text={styles.labelInput}>
                        Próxima Cita:
                      </FormControl.Label>
                      <Button
                        disabled={uploading ? true : false}
                        size="lg"
                        variant="outline"
                        leftIcon={
                          <Icon
                            as={MaterialCommunityIcons}
                            name="calendar"
                            size="sm"
                          />
                        }
                        onLongPress={() => showMode("date")}
                      >
                        {text.length > 1 ? text : "Seleccione una Fecha"}
                      </Button>
                    </FormControl>
                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        minimumDate={fechaProxMin}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeDate}
                      />
                    )}

                    <FormControl isInvalid={"descripcion" in errors}>
                      <FormControl.Label _text={styles.labelInput}>
                        Descripcion de la atencion:
                      </FormControl.Label>
                      <Input
                        multiline
                        numberOfLines={4}
                        style={{ height: 80 }}
                        _focus={styles.inputSeleccionado}
                        InputLeftElement={
                          <Icon
                            as={
                              <MaterialCommunityIcons name="file-edit-outline" />
                            }
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                        value={values.descripcion}
                        onChangeText={handleChange("descripcion")}
                        onBlur={() => setFieldTouched("descripcion")}
                      />
                      {touched.descripcion && errors.descripcion && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          {errors.descripcion}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <HStack
                      mb={5}
                      space={1}
                      paddingTop="3"
                      justifyContent="center"
                    >
                      <Ionicons.Button
                        backgroundColor={"rgba(117, 140, 255, 1)"}
                        size={22}
                        onPress={() => {
                          setModalVisible(true);
                        }}
                        style={{
                          alignSelf: "stretch",
                          justifyContent: "center",
                        }}
                        name="create"
                        _disabled={styles.botonDisabled}
                        disabled={uploading ? true : false}
                      >
                        Agregar Detalle Receta
                      </Ionicons.Button>
                    </HStack>
                    <ScrollView nestedScrollEnabled={true}>
                      {detallesReceta.length === 0 ? (
                        <View style={{ alignSelf: "center", marginBottom: 5 }}>
                          <Text style={{ alignSelf: "center" }}>
                            Esta atencion no posee detalles para la receta
                          </Text>
                          <Text style={{ alignSelf: "center" }} bold>
                            Si se requiere puede recetar los productos
                            necesarios para el paciente
                          </Text>
                        </View>
                      ) : (
                        detallesReceta.map((detalle, index) => {
                          return (
                            <ListItem.Swipeable
                              key={index}
                              bottomDivider
                              leftContent={
                                <ButtonElements
                                  title="Eliminar"
                                  onPress={() => {
                                    Alert.alert(
                                      "Confirmacion",
                                      "Desea eliminar el detalle seleccionado?",
                                      [
                                        {
                                          text: "Eliminar",
                                          onPress: () => {
                                            detallesReceta.splice(index, 1);
                                            setElements(elements - 1);
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
                                  <Text>
                                    Producto: {detalle.nombreProducto}
                                  </Text>
                                </ListItem.Title>
                                <View>
                                  <Text style={styles.ratingText}>
                                    Marca: {detalle.marcaProducto}
                                  </Text>
                                  <Text style={styles.ratingText}>
                                    Tipo: {detalle.tipo}
                                  </Text>
                                  <Text style={styles.ratingText}>
                                    Indicaciones: {detalle.indicaciones}
                                  </Text>
                                </View>
                              </ListItem.Content>
                              <ListItem.Chevron />
                            </ListItem.Swipeable>
                          );
                        })
                      )}
                    </ScrollView>
                    <HStack mb={20} space={2} justifyContent="center">
                      <Ionicons.Button
                        backgroundColor={"rgba(117, 140, 255, 1)"}
                        size={22}
                        onPress={handleSubmit}
                        style={{
                          alignSelf: "stretch",
                          justifyContent: "center",
                        }}
                        name="save"
                        _disabled={styles.botonDisabled}
                        disabled={uploading ? true : false}
                      >
                        Guardar
                      </Ionicons.Button>
                      <Ionicons.Button
                        backgroundColor={"rgba(117, 140, 255, 1)"}
                        size={22}
                        onPress={() => {
                          resetForm();
                          setText("");
                          setElements(0);
                          setDetallesReceta([]);
                        }}
                        style={{
                          alignSelf: "stretch",
                          justifyContent: "center",
                        }}
                        name="refresh-outline"
                        _disabled={styles.botonDisabled}
                        disabled={uploading ? true : false}
                      >
                        Reestablecer
                      </Ionicons.Button>
                    </HStack>
                  </VStack>
                </View>
              )}
            </Formik>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
};

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
    color: "indigo",
    fontSize: 18,
    fontWeight: "bold",
  },
  ratingText: {
    paddingLeft: 10,
    color: "grey",
  },
  indicador: {
    position: "absolute",
    top: "50%",
    left: "25%",
    right: "25%",
  },
};

export default CreateAtenciones;
