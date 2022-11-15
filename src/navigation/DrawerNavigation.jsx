/*Este componente es el encargado de crear la DrawerNavigation, para ello hara uso del componente CustomDrawer que nosotros creamos*/

import React from "react";
//Importancia requerida para poder crear la barra
import { createDrawerNavigator } from "@react-navigation/drawer";

//Importamos los componentes que seran las pestañas de la barra
import Profile from "../views/Profile/Profile";
import TabNavigator from "./TabNavigator";
import Home from "../views/Home";

//Importacione necesarias para asignarle icono a cada pestaña
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";

//Importamos el CustomDrawer que creamos
import CustomDrawer from "../components/CustomDrawer";

//Creamos la Drawer
const Drawer = createDrawerNavigator();

//Es importante recalcar que nuestra drawer no debe tener el componente NavigationContainer, ya que este se creara en App.js
export default function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: "rgba(117, 140, 255, 1)",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Pacientes"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="pets" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={Profile}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
