import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "../screens/Profile/ProfileScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import UserDetail from "../components/ListOfUsers/UserDetail";
import Contact from "../screens/Vendor/Contact";
import EditProduct from "../screens/Home/EditProducts"
import Home from "./HomeNavigator";
import ProductContainer from "../screens/Home/ProductContainer";
import ProductsOfVendor from "../components/ListOfProducts/ListOfAllProductsForVendor";

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Edit Profile"
                component={EditProfileScreen}
                options={{
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="Vendor Products"
                component={ProductsOfVendor}
                options={{
                    headerShown: false
                }}
            />
             <Stack.Screen
                name="Edit Product"
                component={EditProduct}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Home"
                component={ProductContainer}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}

export default function ProfileNavigator() {
    return <MyStack />;
}
