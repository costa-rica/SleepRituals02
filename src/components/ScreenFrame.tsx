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

		const prevScreen =
			currentIndex > 0
				? {
						name: screens[currentIndex - 1],
						title: SCREEN_TITLES[screens[currentIndex - 1]],
						opacity: 0.3,
						position: "left" as const,
				  }
				: null;

		const currentScreenItem = {
			name: currentScreen,
			title: SCREEN_TITLES[currentScreen],
			opacity: 1,
			position: "center" as const,
		};

		const nextScreen =
			currentIndex < screens.length - 1
				? {
						name: screens[currentIndex + 1],
						title: SCREEN_TITLES[screens[currentIndex + 1]],
						opacity: 0.4,
						position: "right" as const,
				  }
				: null;

		return { prevScreen, currentScreenItem, nextScreen };
	};

	const { prevScreen, currentScreenItem, nextScreen } =
		getNavigationWheelItems();

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
				{/* Previous Screen (left) */}
				{prevScreen && (
					<Text
						style={[
							styles.navigationText,
							styles.navigationLeft,
							{ opacity: prevScreen.opacity },
						]}
					>
						{prevScreen.title}
					</Text>
				)}

				{/* Current Screen (center) */}
				<Text
					style={[
						styles.navigationText,
						styles.navigationCenter,
						{ opacity: currentScreenItem.opacity },
					]}
				>
					{currentScreenItem.title}
				</Text>

				{/* Next Screen (right) */}
				{nextScreen && (
					<Text
						style={[
							styles.navigationText,
							styles.navigationRight,
							{ opacity: nextScreen.opacity },
						]}
					>
						{nextScreen.title}
					</Text>
				)}
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
		alignItems: "flex-start",
		paddingTop: 60,
		paddingHorizontal: 20,
		zIndex: 10,
		position: "relative",
		width: "100%",
	},
	navigationText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
		letterSpacing: 1,
		lineHeight: 20,
	},
	navigationLeft: {
		position: "absolute",
		left: 20,
		top: 60,
	},
	navigationCenter: {
		// This will be centered by the parent's justifyContent: center
	},
	navigationRight: {
		position: "absolute",
		right: 20,
		top: 60,
	},
	content: {
		flex: 1,
		zIndex: 1,
	},
});

export default ScreenFrame;
