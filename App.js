import "react-native-gesture-handler";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./src/views/Auth/Login";
import Register from "./src/views/Auth/Register";
import ResetPassword from "./src/views/Auth/ResetPassword";
import CompleteProfile from "./src/views/Profile/CompleteProfile";
import UpdatePaciente from "./src/views/Paciente/UpdatePaciente";
import UpdateDesparasitacion from "./src/views/Paciente/UpdateDesparasitacion";

import { View } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import AppDrawer from "./src/navigation/DrawerNavigation";
import TabNavigator from "./src/navigation/TabNavigator";
import TopTabNavigator from "./src/navigation/TopTabNavigator";

import { signOut } from "firebase/auth";
import { auth } from "./config/firebase";
import CreateAtenciones from "./src/views/Paciente/CreateAtenciones";
import CreateVacunas from "./src/views/Paciente/CreateVacunas";
import CreateDesparasitacion from "./src/views/Paciente/CreateDesparasitacion";
import DetailsVacuna from "./src/views/Paciente/DetailsVacuna";
import DetailsDesparasitacion from "./src/views/Paciente/DetailsDesparasitacion";
import DetailsAtencion from "./src/views/Paciente/DetailsAtencion";

import UpdateVacuna from "./src/views/Paciente/UpdateVacuna";
import { SSRProvider } from "react-bootstrap";

const Stack = createNativeStackNavigator();
const navigationRef = React.createRef();

export default function App() {
  return (
    <SSRProvider>
      <NavigationContainer ref={navigationRef} initialRouteName="Login">
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: "Login",
              headerLeft: () => null,
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ title: "Registrate" }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ title: "Resetear Password" }}
          />
          <Stack.Screen
            name="UpdatePaciente"
            component={UpdatePaciente}
            options={{ title: "" }}
          />
          <Stack.Screen
            name="UpdateVacuna"
            component={UpdateVacuna}
            options={{ title: "" }}
          />
          <Stack.Screen
            name="UpdateDesparasitacion"
            component={UpdateDesparasitacion}
            options={{ title: "Actualizar Desparasitación" }}
          />
          <Stack.Screen
            name="CompleteProfile"
            component={CompleteProfile}
            options={{
              title: "Completar Registro",
              headerBackVisible: false,
              headerRight: () => (
                <View
                  style={{
                    justiftyContent: "center",
                    alignItems: "center",
                    margin: 10,
                  }}
                >
                  <Ionicons.Button
                    backgroundColor={"rgba(117, 140, 255, 1)"}
                    name="exit"
                    size={22}
                    onPress={async () => {
                      await signOut(auth);
                      navigationRef.current?.reset({
                        index: 0,
                        routes: [
                          {
                            name: "Login",
                          },
                        ],
                      });
                    }}
                  >
                    Cerrar sesion
                  </Ionicons.Button>
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="AppMain"
            component={AppDrawer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Paciente"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateAtenciones"
            component={CreateAtenciones}
            options={{ headerShown: true, title: "Atenciones" }}
          />
          <Stack.Screen
            name="TabPaciente"
            component={TopTabNavigator}
            options={{ headerShown: true, title: "Historial del paciente" }}
          />
          <Stack.Screen
            name="CreateVacunas"
            component={CreateVacunas}
            options={{ headerShown: true, title: "Vacuna" }}
          />
          <Stack.Screen
            name="CreateDesparasitacion"
            component={CreateDesparasitacion}
            options={{ headerShown: true, title: "Desparasitación" }}
          />
          <Stack.Screen
            name="DetailsVacuna"
            component={DetailsVacuna}
            options={{ headerShown: true, title: "Detalles Vacuna" }}
          />
          <Stack.Screen
            name="DetailsDesparasitacion"
            component={DetailsDesparasitacion}
            options={{ headerShown: true, title: "Detalles Desparasitación" }}
          />
          <Stack.Screen
            name="DetailsAtencion"
            component={DetailsAtencion}
            options={{ headerShown: true, title: "Detalles Atención" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SSRProvider>
  );
}
