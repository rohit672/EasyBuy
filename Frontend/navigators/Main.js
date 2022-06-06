import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
// Stacks
import HomeNavigator from "./HomeNavigator";
import AddProductNavigator from "./AddProductNavigator";
import ProfileNavigator from "./ProfileNavigator";
import EditProductNAvigator from "./EditProductNavigator"; 
import MapNavigator from "./MapNavigator";
import ContactNavigator from "./ContactNavigator";
const customColor = require("../constants/Color");
import { useSelector } from "react-redux";
const Tab = createBottomTabNavigator();

export default function Main() {
    const token = useSelector((state) => state.token);
    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBarOptions={{
                keyboardHidesTabBar: true,
                showLabel: false,
                activeTintColor: customColor.dark
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon
                            name="home"
                            style={{ position: "relative" }}
                            color={color}
                            size={30}
                        />
                    )
                }}
            />

            {/* <Tab.Screen
                name="Map"
                component={MapNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="map-marker-alt" color={color} size={30} />
                    )
                }}
            /> */}

            {token.isVendor === true ? (
                <Tab.Screen
                    name="AddItem"
                    component={AddProductNavigator}
                    options={{
                        tabBarIcon: ({ color }) => (
                            // <Icon name="plus-circle" color={color} size={30} />
                            // <MaterialIcons name="add-to-photos" size={30} color={color} />
                            // <MaterialIcons name="playlist-add" size={30} color={color} />
                            // <MaterialIcons name="post-add" size={30} color={color} />
                            // <MaterialIcons name="addchart" size={30} color="black" />
                            // <MaterialIcons name="add-circle-outline" size={30} color="black" />
                            <AntDesign name="addfolder" size={24} color={color} />
                            // <MaterialIcons name="shape-square-rounded-plus" size={24} color="black" />
                            // <Feather name="folder-plus" size={25} color={color} />
                            // <AntDesign name="plussquareo" size={24} color="black" />
                            // <AntDesign name="addfile" size={24} color={color} />
                            
                        )
                    }}
                />
            ) : null}

            <Tab.Screen
                name="Contact"
                component={ContactNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <View>
                            <MaterialCommunityIcons name="playlist-check" color={color} size={30} />
                            {/* <CartIcon /> */}
                        </View>
                    )
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileNavigator}
                options={{
                    tabBarIcon: ({ color }) => <Icon name="user" color={color} size={30} />
                }}
            />
{/* 
             <Tab.Screen
                name="EditProduct"
                component={EditProductNAvigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <View>
                            <MaterialCommunityIcons name="circle-edit-outline" size={30} color={color} />
                        </View>
                    )
                }}
            /> */}
            

        </Tab.Navigator>
    );
}
