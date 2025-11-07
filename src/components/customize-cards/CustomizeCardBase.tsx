import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/designTokens';

interface CustomizeCardBaseProps {
	title: string;
	children: React.ReactNode;
}

/**
 * Base container component for all customize cards.
 * Provides consistent styling (background, border, padding, title) 
 * while allowing unique controls to be passed as children.
 */
const CustomizeCardBase: React.FC<CustomizeCardBaseProps> = ({ 
	title, 
	children 
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: spacing.cardMarginBottom,
		borderRadius: spacing.cardBorderRadius,
		borderWidth: 1,
		borderColor: colors.cardBorder,
		backgroundColor: colors.cardBackground,
		padding: spacing.cardPadding,
	},
	title: {
		fontSize: typography.cardTitle.fontSize,
		fontWeight: typography.cardTitle.fontWeight,
		color: colors.textSecondary,
		marginBottom: 8,
	},
});

export default CustomizeCardBase;

