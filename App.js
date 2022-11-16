import "react-native-gesture-handler";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./src/views/Auth/Login";
import Register from "./src/views/Auth/Register";
import ResetPassword from "./src/views/Auth/ResetPassword";
import CompleteProfile from "./src/views/Profile/CompleteProfile";

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
import CreateReceta from "./src/views/Paciente/CreateReceta";

const Stack = createNativeStackNavigator();
const navigationRef = React.createRef();

export default function App() {
  return (
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
                  backgroundColor={"argb(117, 140, 255, 1)"}
                  name="exit"
                  size={22}
                  onPress={() => {
                    signOut(auth);
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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TabPaciente"
          component={TopTabNavigator}
          options={{ headerShown: true,title:"Historial del paciente" }}
        />
         <Stack.Screen
          name="CreateVacunas"
          component={CreateVacunas}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateDesparasitacion"
          component={CreateDesparasitacion}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateReceta"
          component={CreateReceta}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
