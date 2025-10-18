import React from "react";
import { View, StyleSheet } from "react-native";

interface ScreenFrameProps {
	children: React.ReactNode;
}

const ScreenFrame: React.FC<ScreenFrameProps> = ({ children }) => {
	return (
		<View style={styles.container}>
			{/* Screen Content */}
			<View style={styles.content}>{children}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "transparent",
	},
	content: {
		flex: 1,
		paddingTop: 140, // Offset for fixed navigation wheel at top
	},
});

export default ScreenFrame;
