import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated, Easing } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const FIELD_WIDTH = SCREEN_WIDTH * 3; // 3x screen width for wrapping
const PARALLAX_RATIO = 0.25; // Stars move at 25% of content speed

interface StarFieldProps {
	screenIndex: number; // 0 for GoodTimes, 1 for Breathing, 2 for Mantra
}

// Generate random stars with better distribution
const generateStars = (count: number) => {
	const stars = [];
	for (let i = 0; i < count; i++) {
		// Ensure better coverage in the top portion of screen
		const yBias = Math.random() < 0.4 ? Math.random() * (SCREEN_HEIGHT * 0.4) : Math.random() * SCREEN_HEIGHT;

		stars.push({
			id: i,
			x: Math.random() * FIELD_WIDTH,
			y: yBias,
			size: Math.random() * 2 + 0.5, // 0.5-2.5px for variety
			opacity: Math.random() * 0.6 + 0.2, // 0.2-0.8 for subtle variety
		});
	}
	return stars;
};

const STARS = generateStars(150); // Increased from 100 to 150 for better coverage

const StarField: React.FC<StarFieldProps> = ({ screenIndex }) => {
	const translateX = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Calculate target position based on screen index
		// When screenIndex increases, stars move left (negative translateX)
		const targetX = -screenIndex * SCREEN_WIDTH * PARALLAX_RATIO;

		Animated.timing(translateX, {
			toValue: targetX,
			duration: 400,
			easing: Easing.bezier(0.4, 0.0, 0.2, 1.0), // Match navigation easing
			useNativeDriver: true,
		}).start();
	}, [screenIndex]);

	// Wrap the position to create infinite loop
	const wrappedTranslateX = translateX.interpolate({
		inputRange: [-FIELD_WIDTH, 0, FIELD_WIDTH],
		outputRange: [0, 0, 0],
		extrapolate: 'extend',
	});

	return (
		<Animated.View
			style={[
				styles.container,
				{
					transform: [{ translateX: translateX }],
				},
			]}
		>
			{STARS.map((star) => (
				<View
					key={star.id}
					style={[
						styles.star,
						{
							left: star.x,
							top: star.y,
							width: star.size,
							height: star.size,
							opacity: star.opacity,
						},
					]}
				/>
			))}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		width: FIELD_WIDTH,
		height: SCREEN_HEIGHT,
		top: 0,
		left: 0,
		// Performance optimizations
		shouldRasterizeIOS: true,
		renderToHardwareTextureAndroid: true,
	},
	star: {
		position: "absolute",
		backgroundColor: "#FFFFFF",
		borderRadius: 1,
	},
});

export default StarField;
