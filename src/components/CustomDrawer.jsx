/*En este componente inicia el flujo, aca se creara la barra personalizada, aqui se utilizan algunos modulos
de React Navigation que solo sirven para maquetar la barra*/

import React from "react";

//Importamos elementos necesarios para el diseño, pueden ser los nativos o de native-base
import { Text, View, Image, ImageBackground } from "react-native";

// DrawerContentScrollView es necesario ya que todo el contenido de nuestra barra debe ser scrolleable,todo ira dentro de este
//DrawerItemList es necesario para definir el listado de los elementos (pestañas) de navegacion
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

//Para obtener el correo del usuario iniciado
import { auth } from "../../config/firebase";
import { NativeBaseProvider } from "native-base";

import Ionicons from "react-native-vector-icons/Ionicons";
import { signOut } from "firebase/auth";

export default function CustomDrawer(props) {
  return (
    //Todo debe estar contenido en una View con Flex
    <NativeBaseProvider style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <ImageBackground
          source={require("../../assets/fondoveterinario.jpg")}
          style={{ padding: 20 }}
        >
          <Image
            source={{
              uri: "https://us.123rf.com/450wm/yupiramos/yupiramos1804/yupiramos180421545/100217337-m%C3%A9dico-veterinario-con-perro-avatar-ilustraci%C3%B3n-vectorial-character-design.jpg?ver=6",
            }}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text
            style={{
              color: "#fff",
              fontSize: 17,
              fontWeight: "bold",
              marginBottom: 5,
            }}
          >
            {auth.currentUser.email}
          </Text>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{ margin: 10, justiftyContent: "center", alignItems: "center" }}
      >
        <Ionicons.Button
          backgroundColor={"rgba(56, 109, 255, 0.58)"}
          name="exit"
          size={22}
          onPress={()=>{
            signOut(auth);
            props.navigation.reset({
            index:0,
            routes:[{
              name:"Login"
            }]
          })}}
        >
          Cerrar sesion
        </Ionicons.Button>
      </View>
    </NativeBaseProvider>
  );
}
