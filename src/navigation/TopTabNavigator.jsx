import { Text, View } from "react-native";
import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DetailsPaciente from "../views/Paciente/DetailsPaciente";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Vacunas from "../views/Paciente/Vacunas";
import Atenciones from "../views/Paciente/Atenciones";
import Desparasitacion from "../views/Paciente/Desparasitacion";

const Tab = createMaterialTopTabNavigator();

export default function TopTabNavigator({ navigation, route }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="DetailsPaciente"
        component={DetailsPaciente}
        initialParams={route.params}
        options={{
          tabBarLabel: "Detalles",
          tabBarScrollEnabled: true,
        }}
      />
      <Tab.Screen
        name="Vacunas"
        component={Vacunas}
        initialParams={route.params}
        options={{
          tabBarLabel: "Vacunas",
          tabBarScrollEnabled: true,
        }}
      />

      <Tab.Screen
        name="Desparasitacion"
        component={Desparasitacion}
        initialParams={route.params}
        options={{
          tabBarScrollEnabled: true,
          tabBarLabel: "Desparasitacion",
        }}
      />
      <Tab.Screen
        name="Atenciones"
        component={Atenciones}
        initialParams={route.params}
        options={{
          tabBarLabel: "Atenciones",
          tabBarScrollEnabled: true,
        }}
      />
    </Tab.Navigator>
  );
}
