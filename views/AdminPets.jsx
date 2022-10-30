import React from 'react'
import { NativeBaseProvider, Text, Button } from "native-base"
import { Avatar, ListItem } from "react-native-elements";
import { auth } from '../config/firebase'
import { signOut } from 'firebase/auth'

const AdminPets = ({navigation}) => {
    const exit = () => {
        signOut(auth).then(() => {
            navigation.replace("Login")
        }).catch((error) => {
            alert(error.message)
        });
    }
    return (
        <NativeBaseProvider>
            <Text>Email: {auth.currentUser?.email}</Text>
            <Text>UUID: {auth.currentUser?.uid}</Text>
            <Button size={"lg"} pt={"5"} onPress={exit}>Salir</Button>
            <Button size={"lg"} pt={"5"} onPress={() => {navigation.navigate("CreatePatient")}}>Crear Paciente</Button>
        </NativeBaseProvider>
    )
}

export default AdminPets