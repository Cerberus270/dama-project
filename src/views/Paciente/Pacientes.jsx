import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CreatePaciente from './CreatePaciente';

function AddPaciente() {
    return (
        <CreatePaciente />
    );
}

function Profile() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Aqui no se que putas poner</Text>
        </View>
    );
}

function Notifications() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Aqui va la lista de pacientes</Text>
        </View>
    );
}

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            activeColor="white"
            barStyle={{
                backgroundColor: '#386dff',
            }}>
            <Tab.Screen
                name="AddPaciente"
                component={AddPaciente}
                options={{
                    tabBarLabel: 'Agregar',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="plus" size={26} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    tabBarLabel: 'Pacientes',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="clipboard-list" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: 'Ni Idea',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function Pacientes() {
    return (
        <MyTabs />
    );
}