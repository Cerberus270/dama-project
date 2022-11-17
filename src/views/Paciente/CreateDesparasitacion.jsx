import React, {useEffect, useState} from 'react'
import {Alert} from 'react-native';
// Components Imports
import {
    NativeBaseProvider,
    ScrollView,
    Box,
    Heading,
    VStack,
    FormControl,
    Input,
    Text,
    Button,
    View,
    WarningOutlineIcon,
    Icon,
    HStack,
    Radio,
    resetForm,
    Pressable
} from "native-base"
// Validation Imports
import * as yup from 'yup';
import {Formik, getIn} from 'formik';
import {MaterialCommunityIcons} from '@expo/vector-icons';
// Other Components
// Firebase Auth and Firestore
import {auth, db} from '../../../config/firebase'
import {addDoc, collection} from "firebase/firestore";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {Platform} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const CreateDesparasitacion = () => {

    return (
        <NativeBaseProvider>
            <ScrollView>
                <Box w={"95%"} mt={8} flex={1} p={1} marginLeft={1}>
                    <Heading mt="1" color="coolGray.600" _dark={{
                        color: "warmGray.200"
                    }} fontWeight="medium" size="xs">
                        <Text style={styles.tituloForm}>Control de Desparasitación</Text>
                    </Heading>
                    
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = {
    inputSeleccionado: {
        bg: "coolGray.200:alpha.100"
    },
    botonDisabled: {
        backgroundColor: '#00aeef'
    },
    labelInput: {
        color: 'black',
        fontSize: 'sm',
        fontWeight: 'bold'
    },
    tituloForm: {
        color: 'indigo',
        fontSize: 18,
        fontWeight: 'bold'
    }
}

export default CreateDesparasitacion