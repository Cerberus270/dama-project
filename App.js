import React, { useState, useEffect } from 'react'

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import Login from "./views/Login";
import Register from "./views/Register";
import AdminPets from "./views/AdminPets";



const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name ="Login" component={Login} options={{title: "Login"}} />
        <Stack.Screen name ="Register" component={Register} options={{title: "Registrate"}} />
        <Stack.Screen name ="AdminPets" component={AdminPets} options={{title: "Administrador Mascotas"}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}