import React, {useEffect} from 'react';
import {
    NativeBaseProvider, VStack, ZStack, Stack, Center, Box, Heading,
    Divider, StyleSheet, Text, View, Button, ScrollView, FormControl
    , InputGroup, InputLeftAddon, WarningOutlineIcon, Input
} from 'native-base';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';


export default function DetailsPaciente({ navigation, route }) {
    console.log(route)
    return (
            <NativeBaseProvider>
                <ScrollView>
                    <Box mt={5} flex={1} p={1} w="95%" mx='auto' justifyContent={'center'}>
                        <VStack space={2} px="2" alignItems="center" bg={'amber.100'} rounded='50' justifyContent="center">
                            <Heading size="md" pt={'3'}>Detalles Paciente</Heading>
                            <Stack mb="2.5" mt="1.5" direction={{
                                base: "column",
                                md: "row"
                            }} space={2} mx={{
                                base: "auto",
                                md: "0"
                            }}>
                                <Button size="lg" variant="outline">
                                    Vacunas Paciente
                                </Button>
                                <Button size="lg" variant="outline">
                                    Desparasitante Paciente
                                </Button>
                                <Text mt={5}>
                                    esos 2 botones llevaran a la vistas de vacunas y desparasitante alli agregen sus vistas, y alli hare los list views
                                    aqui van los list view de atenciones, y el boton para crear atencion, asi que me falta eso, pero les dejo listo aqui eso
                                </Text>
                            </Stack>
                        </VStack>
                    </Box>
                </ScrollView>
            </NativeBaseProvider>
            )
}