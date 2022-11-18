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
            source={require("../../assets/Logo.png")}
            style={{
              backgroundColor:'white',
              height: 90,
              width: 90,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
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
          backgroundColor={"rrgba(117, 140, 255, 1)"}
          name="exit"
          size={22}
          onPress={async ()=>{
            await signOut(auth);
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
