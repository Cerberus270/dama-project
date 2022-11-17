import React, { useEffect } from "react";
import {
  NativeBaseProvider,
  VStack,
  ZStack,
  Stack,
  Center,
  Box,
  Heading,
  Divider,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  FormControl,
  InputGroup,
  InputLeftAddon,
  WarningOutlineIcon,
  Input,
} from "native-base";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";

export default function DetailsPaciente({ navigation, route }) {
  const { id, nombre } = route.params;

  return (
    <NativeBaseProvider>
      <ScrollView>
        <Box mt={5} flex={1} p={1}>
          
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
}
