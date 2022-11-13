import React, { useState, useEffect } from 'react'

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import 'react-native-gesture-handler';


import Login from "./views/Login";
import Register from "./views/Register";
import AdminPets from "./views/AdminPets";
import ResetPassword from './views/ResetPassword';
import CreatePatient from './views/CreatePatient';
import CompleteProfile from './views/CompleteProfile';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer initialRouteName="Login">
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ title: "Login", headerLeft: () => null, headerBackVisible: false }} />
        <Stack.Screen name="Register" component={Register} options={{ title: "Registrate" }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: "Resetear Password" }} />
        <Stack.Screen name="AdminPets" component={AdminPets} options={{
          title: 'Administrador de Pacientes',
          headerBackVisible: false,
          headerShown: true,
          gestureEnabled: false,
          headerLeft: () => null,
        }} />
        <Stack.Screen name="CreatePatient" component={CreatePatient} options={{ title: "Crear Paciente" }} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfile} options={{title:"Completar Registro",headerBackVisible:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}