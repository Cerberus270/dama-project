import * as React from 'react';
import {Text, View} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import CreatePaciente from './CreatePaciente';
import ListPacientes from "./ListPacientes";


function AddPaciente() {
    return (
        <CreatePaciente/>
    );
}

function Profile() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Aqui no se que putas poner</Text>
        </View>
    );
}

function ListarPacientes() {
    return (
        <ListPacientes/>
    );
}

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            activeColor="white"
            barStyle={{
                backgroundColor: 'rgba(117, 140, 255, 1)',
            }}>
            <Tab.Screen
                name="AddPaciente"
                component={AddPaciente}
                options={{
                    tabBarLabel: 'Agregar',
                    tabBarIcon: ({color}) => (
                        <MaterialCommunityIcons name="plus" size={26} color={color}/>
                    ),
                }}
            />
            <Tab.Screen
                name="ListarPacientes"
                component={ListarPacientes}
                options={{
                    tabBarLabel: 'Pacientes',
                    tabBarIcon: ({color}) => (
                        <MaterialCommunityIcons name="clipboard-list" color={color} size={26}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: 'Ni Idea',
                    tabBarIcon: ({color}) => (
                        <MaterialCommunityIcons name="account" color={color} size={26}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function Pacientes() {
    return (
        <MyTabs/>
    );
}