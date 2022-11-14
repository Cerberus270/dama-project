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

import { signOut } from "firebase/auth";
import { auth } from "./config/firebase";

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
                  margin:10
                }}
              >
                <Ionicons.Button
                  backgroundColor={"rgba(117, 140, 255, 1)"}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
