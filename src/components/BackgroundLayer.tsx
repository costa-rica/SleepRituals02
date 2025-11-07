import React from "react";
import {
	View,
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../types/navigation";
import StarField from "./StarField";

type ScreenName = "GoodTimes" | "Breathing" | "Mantra";

interface BackgroundLayerProps {
	screenIndex: number;
	currentScreen: ScreenName;
	children: React.ReactNode;
}

const SCREEN_TITLES: Record<ScreenName, string> = {
	GoodTimes: "GOOD TIMES",
	Breathing: "BREATHING",
	Mantra: "MANTRA",
};

const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
	screenIndex,
	currentScreen,
	children,
}) => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	
	const screens: ScreenName[] = ["GoodTimes", "Breathing", "Mantra"];
	const currentIndex = screens.indexOf(currentScreen);

	// Determine which screens to show in each position
	const prevScreen = currentIndex > 0
		? {
				name: screens[currentIndex - 1],
				title: SCREEN_TITLES[screens[currentIndex - 1]],
				opacity: 0.3,
		  }
		: null;

	const currentScreenItem = {
		name: currentScreen,
		title: SCREEN_TITLES[currentScreen],
		opacity: 1,
	};

	const nextScreen = currentIndex < screens.length - 1
		? {
				name: screens[currentIndex + 1],
				title: SCREEN_TITLES[screens[currentIndex + 1]],
				opacity: 0.4,
		  }
		: null;

	return (
		<View style={styles.container}>
			{/* Fixed Background Image */}
			<ImageBackground
				source={require("../assets/images/screen-frame/IllustrationBackground.png")}
				style={styles.backgroundImage}
				resizeMode="cover"
			>
				{/* Gradient overlay to fade the image */}
				<View style={styles.gradientOverlay} />
			</ImageBackground>

			{/* Animated Star Field - with parallax effect */}
			<StarField screenIndex={screenIndex} />

			{/* Fixed Navigation Wheel Header */}
			<View style={styles.navigationWheel}>
				{/* Left side container */}
				<View style={styles.navSideLeft}>
					{prevScreen && (
						<TouchableOpacity
							onPress={() => {
								navigation.navigate(prevScreen.name as keyof RootStackParamList);
							}}
							activeOpacity={0.6}
						>
							<Text style={[styles.navigationText, styles.navLeftText, { opacity: prevScreen.opacity }]}>
								{prevScreen.title}
							</Text>
						</TouchableOpacity>
					)}
				</View>

				{/* Current Screen (center) - Always centered */}
				<View style={styles.navCenter}>
					<Text style={[styles.navigationText, { opacity: currentScreenItem.opacity }]}>
						{currentScreenItem.title}
					</Text>
				</View>

				{/* Right side container */}
				<View style={styles.navSideRight}>
					{nextScreen && (
						<TouchableOpacity
							onPress={() => {
								navigation.navigate(nextScreen.name as keyof RootStackParamList);
							}}
							activeOpacity={0.6}
						>
							<Text style={[styles.navigationText, styles.navRightText, { opacity: nextScreen.opacity }]}>
								{nextScreen.title}
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Screen content slides over this fixed background */}
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F1015",
	},
	backgroundImage: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 400,
		width: "100%",
	},
	gradientOverlay: {
		flex: 1,
		backgroundColor: "transparent",
		opacity: 0.3,
	},
	navigationWheel: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		paddingTop: 80,
		zIndex: 100,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
	},
	navSideLeft: {
		flex: 1,
		alignItems: "flex-end",
	},
	navSideRight: {
		flex: 1,
		alignItems: "flex-start",
	},
	navCenter: {},
	navLeftText: {
		paddingRight: 40,
	},
	navRightText: {
		paddingLeft: 40,
	},
	navigationText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#FFFFFF",
		letterSpacing: 1,
		lineHeight: 20,
		textAlign: "center",
	},
});

export default BackgroundLayer;
