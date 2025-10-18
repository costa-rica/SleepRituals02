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
				{/* Left side container - takes up space to balance right */}
				<View style={styles.navSideLeft}>
					{prevScreen && (
						<Text
							style={[
								styles.navigationText,
								styles.navLeftText,
								{ opacity: prevScreen.opacity },
							]}
						>
							{prevScreen.title}
						</Text>
					)}
				</View>

				{/* Current Screen (center) - Always centered */}
				<View style={styles.navCenter}>
					<Text
						style={[
							styles.navigationText,
							{ opacity: currentScreenItem.opacity },
						]}
					>
						{currentScreenItem.title}
					</Text>
				</View>

				{/* Right side container - takes up space to balance left */}
				<View style={styles.navSideRight}>
					{nextScreen && (
						<Text
							style={[
								styles.navigationText,
								styles.navRightText,
								{ opacity: nextScreen.opacity },
							]}
						>
							{nextScreen.title}
						</Text>
					)}
				</View>
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
		paddingTop: 80,
		zIndex: 10,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
	},
	navSideLeft: {
		flex: 1, // Takes equal space as right side to balance
		alignItems: "flex-end", // Aligns content to the right
	},
	navSideRight: {
		flex: 1, // Takes equal space as left side to balance
		alignItems: "flex-start", // Aligns content to the left
	},
	navCenter: {
		// Center container - no flex, just takes width of text
	},
	navLeftText: {
		paddingRight: 40, // 40px gap from center text
	},
	navRightText: {
		paddingLeft: 40, // 40px gap from center text
	},
	navigationText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#FFFFFF",
		letterSpacing: 1,
		lineHeight: 20,
		textAlign: "center",
	},
	content: {
		flex: 1,
		zIndex: 1,
	},
});

export default ScreenFrame;
