import React from "react";
import {
	View,
	ImageBackground,
	StyleSheet,
	Text,
	Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

type ScreenName = "GoodTimes" | "Breathing" | "Mantra";

interface ScreenFrameProps {
	children: React.ReactNode;
	currentScreen: ScreenName;
}

const SCREEN_TITLES: Record<ScreenName, string> = {
	GoodTimes: "GOOD TIMES",
	Breathing: "BREATHING",
	Mantra: "MANTRA",
};

const ScreenFrame: React.FC<ScreenFrameProps> = ({
	children,
	currentScreen,
}) => {
	// Determine which screens to show in the navigation wheel
	const getNavigationWheelItems = () => {
		const screens: ScreenName[] = ["GoodTimes", "Breathing", "Mantra"];
		const currentIndex = screens.indexOf(currentScreen);

		return screens.map((screen, index) => {
			const isCurrentScreen = screen === currentScreen;
			const isNextScreen = index === currentIndex + 1;

			return {
				name: screen,
				title: SCREEN_TITLES[screen],
				opacity: isCurrentScreen ? 1 : isNextScreen ? 0.4 : 0,
				position: index - currentIndex,
			};
		});
	};

	const navigationItems = getNavigationWheelItems();

	return (
		<View style={styles.container}>
			{/* Background Image with gradient fade */}
			<ImageBackground
				source={require("../assets/images/screen-frame/IllustrationBackground.png")}
				style={styles.backgroundImage}
				resizeMode="cover"
			>
				{/* Gradient overlay to fade the image */}
				<View style={styles.gradientOverlay} />
			</ImageBackground>

			{/* Navigation Wheel Header */}
			<View style={styles.navigationWheel}>
				{navigationItems.map((item) => {
					if (item.opacity === 0) return null;

					return (
						<Text
							key={item.name}
							style={[
								styles.navigationText,
								{
									opacity: item.opacity,
									marginLeft: item.position === 0 ? 0 : 40,
								},
							]}
						>
							{item.title}
						</Text>
					);
				})}
			</View>

			{/* Screen Content */}
			<View style={styles.content}>{children}</View>
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
		height: 400, // Adjust based on your image height
		width: "100%",
	},
	gradientOverlay: {
		flex: 1,
		backgroundColor: "transparent",
		// This creates a gradient fade effect using opacity
		opacity: 0.3,
	},
	navigationWheel: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 60,
		paddingHorizontal: 20,
		zIndex: 10,
	},
	navigationText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
		letterSpacing: 1,
	},
	content: {
		flex: 1,
		zIndex: 1,
	},
});

export default ScreenFrame;
