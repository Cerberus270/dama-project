import "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import React, { useState, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./views/Login";
import Register from "./views/Register";
import ResetPassword from "./views/ResetPassword";
import CompleteProfile from "./views/CompleteProfile";

import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList } from "@react-navigation/drawer";
import Profile from "./views/Profile";
import Pacientes from "./views/Pacientes";
import Home from "./views/Home";

import { View, Text, Image, TouchableOpacity, Button } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer initialRouteName="Login">
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
          options={{ title: "Completar Registro", headerBackVisible: false }}
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

const Drawer = createDrawerNavigator();

function CustomDrawer(props) {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            backgroundColor: "#f6f6f6",
            marginBottom: 20,
          }}
        >
          <View>
            <Text>John Doe</Text>
            <Text>example@email.com</Text>
          </View>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1624243225303-261cc3cd2fbc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            }}
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 0,
          left: 0,
          bottom: 50,
          backgroundColor: "#f6f6f6",
          padding: 20,
        }}
      >
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Pacientes" component={Pacientes} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}
