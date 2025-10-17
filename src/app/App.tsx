import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./welcome/Splash";
import GoodTimes from "./welcome/GoodTimes";
import Breathing from "./welcome/Breathing";
import Mantra from "./welcome/Mantra";

import type { RootStackParamList } from "../types/navigation";
const Stack = createNativeStackNavigator<RootStackParamList>();

const Index = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Splash" component={Splash} />
				<Stack.Screen name="GoodTimes" component={GoodTimes} />
				<Stack.Screen name="Breathing" component={Breathing} />
				<Stack.Screen name="Mantra" component={Mantra} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Index;
