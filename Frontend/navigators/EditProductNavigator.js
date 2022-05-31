import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProductContainer from "../screens/Home/ProductContainer";
import ProductDetails from "../screens/Home/ProductDetails";
import EditProductDetails from "../screens/Home/EditProducts" ; 
import EditProduct from "../screens/Home/EditProducts" ; 
import ProductListItem from "../components/Card/ProductListItem";

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={EditProduct}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}

export default function HomeNavigator() {
    return <MyStack />;
}
