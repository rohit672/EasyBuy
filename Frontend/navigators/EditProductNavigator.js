import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProductContainer from "../screens/Home/ProductContainer";
import ProductDetails from "../screens/Home/ProductDetails";
import EditProductDetails from "../screens/Home/EditProducts" ; 
import EditProduct from "../screens/Home/EditProducts" ; 
import UserDetail from "../components/ListOfUsers/UserDetail";
import ProductListItem from "../components/Card/ProductListItem";

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Edit Product"
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
