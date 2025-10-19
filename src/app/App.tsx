import { View, Text, Easing, Animated } from "react-native";
import React, { useState } from "react";
import { NavigationContainer, NavigationState } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets, StackCardInterpolationProps } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Splash from "./welcome/Splash";
import GoodTimes from "./welcome/GoodTimes";
import Breathing from "./welcome/Breathing";
import Mantra from "./welcome/Mantra";
import BackgroundLayer from "../components/BackgroundLayer";
import { store, persistor } from "../store";

import type { RootStackParamList } from "../types/navigation";
const Stack = createStackNavigator<RootStackParamList>();

// Custom card style interpolator for complete slide transitions
const customSlideInterpolator = ({ current, next, layouts }: StackCardInterpolationProps) => {
	const { width } = layouts.screen;

	return {
		cardStyle: {
			transform: [
				{
					translateX: current.progress.interpolate({
						inputRange: [0, 1],
						outputRange: [width, 0],
					}),
				},
				{
					translateX: next
						? next.progress.interpolate({
								inputRange: [0, 1],
								outputRange: [0, -width],
						  })
						: 0,
				},
			],
		},
	};
};

// Custom card style interpolator for reverse (back) transitions
const customSlideInterpolatorReverse = ({ current, next, layouts }: StackCardInterpolationProps) => {
	const { width } = layouts.screen;

	return {
		cardStyle: {
			transform: [
				{
					translateX: current.progress.interpolate({
						inputRange: [0, 1],
						outputRange: [-width, 0],
					}),
				},
				{
					translateX: next
						? next.progress.interpolate({
								inputRange: [0, 1],
								outputRange: [0, width],
						  })
						: 0,
				},
			],
		},
	};
};

const SCREEN_INDICES: Record<string, number> = {
	GoodTimes: 0,
	Breathing: 1,
	Mantra: 2,
	Splash: 0,
};

const Index = () => {
	const [screenIndex, setScreenIndex] = useState(0);
	const [currentScreen, setCurrentScreen] = useState<"GoodTimes" | "Breathing" | "Mantra">("GoodTimes");
	const [prevScreenIndex, setPrevScreenIndex] = useState(0);
	const navigationRef = React.useRef<any>(null);

	const handleNavigationStateChange = (state: NavigationState | undefined) => {
		if (!state) return;

		const currentRoute = state.routes[state.index];
		const currentScreenName = currentRoute.name;
		const index = SCREEN_INDICES[currentScreenName] ?? 0;

		// Track previous index for direction detection
		setPrevScreenIndex(screenIndex);
		setScreenIndex(index);

		// Update currentScreen for BackgroundLayer
		if (currentScreenName === "GoodTimes" || currentScreenName === "Breathing" || currentScreenName === "Mantra") {
			setCurrentScreen(currentScreenName);
		}
	};

	// Detect navigation direction
	const isGoingBack = screenIndex < prevScreenIndex;

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<NavigationContainer ref={navigationRef} onStateChange={handleNavigationStateChange}>
					<BackgroundLayer
						screenIndex={screenIndex}
						currentScreen={currentScreen}
						navigation={navigationRef.current}
					>
						<Stack.Navigator
							screenOptions={{
								headerShown: false,
								cardStyleInterpolator: isGoingBack ? customSlideInterpolatorReverse : customSlideInterpolator,
								transitionSpec: {
									open: {
										animation: 'timing',
										config: {
											duration: 400,
											easing: Easing.bezier(0.4, 0.0, 0.2, 1.0), // Gentle ease in/out for sleepy users
										},
									},
									close: {
										animation: 'timing',
										config: {
											duration: 400,
											easing: Easing.bezier(0.4, 0.0, 0.2, 1.0), // Gentle ease in/out for sleepy users
										},
									},
								},
								cardStyle: { backgroundColor: 'transparent' },
								detachPreviousScreen: false, // Keep previous screen mounted during transition
							}}
						>
							<Stack.Screen
								name="GoodTimes"
								component={GoodTimes}
								options={{
									cardStyleInterpolator: isGoingBack ? customSlideInterpolatorReverse : customSlideInterpolator,
								}}
							/>
							<Stack.Screen
								name="Breathing"
								component={Breathing}
								options={{
									cardStyleInterpolator: isGoingBack ? customSlideInterpolatorReverse : customSlideInterpolator,
								}}
							/>
							<Stack.Screen
								name="Mantra"
								component={Mantra}
								options={{
									cardStyleInterpolator: isGoingBack ? customSlideInterpolatorReverse : customSlideInterpolator,
								}}
							/>
							<Stack.Screen name="Splash" component={Splash} />
						</Stack.Navigator>
					</BackgroundLayer>
				</NavigationContainer>
			</PersistGate>
		</Provider>
	);
};

export default Index;
