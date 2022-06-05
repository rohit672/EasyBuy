import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "../screens/User/WelcomeScreen";
import LoginScreen from "../screens/User/LoginScreen";
import RegisterScreen from "../screens/User/RegisterScreen";
import ChoiceScreen from "../screens/User/ChoiceScreen";
import OnboardingScreen from "../screens/User/OnBoardingScreen";
import OnBoard2 from "../screens/User/onBoard2";
import Main from "./Main";

const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => (
    <RootStack.Navigator headerMode="none">
        {/* <RootStack.Screen name="WelcomeScreen" component={WelcomeScreen} /> */}
        {/* <RootStack.Screen name="ChoiceScreen" component={ChoiceScreen} /> */}
        {/* <RootStack.Screen name="WelcomeScreen" component={OnboardingScreen} /> */}
        <RootStack.Screen name="WelcomeScreen" component={OnBoard2} />
        <RootStack.Screen name="LoginScreen" component={LoginScreen} />
        <RootStack.Screen name="RegisterScreen" component={RegisterScreen} />
        <RootStack.Screen name="Main" component={Main} />
    </RootStack.Navigator>
);

export default RootStackScreen;
