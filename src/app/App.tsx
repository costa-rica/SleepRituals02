import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./welcome/Splash";
import Login from "./welcome/Login";

import type { RootStackParamList } from "../types/navigation";
const Stack = createNativeStackNavigator<RootStackParamList>();

const Index = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Splash" component={Splash} />
				<Stack.Screen name="Login" component={Login} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Index;
