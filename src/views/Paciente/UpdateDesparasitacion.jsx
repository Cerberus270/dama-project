import { View, Alert } from "react-native";
import React, { Component, useRef } from "react";
import * as yup from "yup";
import {
  NativeBaseProvider,
  ScrollView,
  Box,
  Heading,
  Text,
  Input,
  FormControl,
  WarningOutlineIcon,
  Icon,
  VStack,
  HStack,
  Select,
  CheckIcon,
  Button
} from "native-base";
import { Avatar } from "react-native-elements";
import { useState } from "react";
import { auth, db } from "../../../config/firebase";
import { doc, getDoc, setDoc, onSnapshot, collection, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Formik, getIn } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Radio } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function UpdateDesparasitacion ({navigation, route}){
   
      return (
        <NativeBaseProvider>
            <View>
              <Text>en construcción....</Text>
            </View>
        </NativeBaseProvider>
      );
    }
    
 