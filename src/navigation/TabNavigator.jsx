import { Text, View } from "react-native";
import React, { Component } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//Importamos los componentes que seran las pestañas de la barra
import CreatePaciente from "../views/Paciente/CreatePaciente";
import ListPacientes from "../views/Paciente/ListPacientes";

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="ListPacientes"
      activeColor="white"
      barStyle={{
        backgroundColor: "rgba(117, 140, 255, 1)",
      }}
    >
      <Tab.Screen
        name="CreatePaciente"
        component={CreatePaciente}
        options={{
          tabBarLabel: "Agregar",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ListPacientes"
        component={ListPacientes}
        options={{
          tabBarLabel: "Pacientes",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
