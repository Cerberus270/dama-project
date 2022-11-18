import React, {useEffect} from 'react';
import {
    NativeBaseProvider, VStack, HStack, ZStack, Stack, Center, Box, Heading,
    Divider, StyleSheet, Text, View, Button, ScrollView, FormControl
    , InputGroup, InputLeftAddon, WarningOutlineIcon, Input
} from 'native-base';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Atenciones({navigation}){
    return (
      <NativeBaseProvider>
                <ScrollView>
                    <Box flex={1} p={1} w="95%" mx='auto' justifyContent={'center'}>
                        <VStack  mt={450} space={2} px="2" alignItems="center" rounded='50' justifyContent="center">          
                            <Stack mb="2.5" mt="1.5" direction={{
                                base: "column",
                                md: "row"
                            }} space={2} mx={{
                                base: "auto",
                                md: "0"
                            }}>
                                
                                 <Ionicons.Button
                                            backgroundColor={"rgba(117, 140, 255, 1)"}
                                            size={22}
                                            onPress={() => {
                                                navigation.navigate('CreateAtenciones');
                                            }}
                                            style={{
                                                alignSelf: "stretch",
                                                justifyContent: "center",
                                            }}
                                            name="save"
                                            >
                                            Crear Atención
                                        </Ionicons.Button>
                         
                            </Stack>
                        </VStack>
                    </Box>
                </ScrollView>
            </NativeBaseProvider>
    )
}