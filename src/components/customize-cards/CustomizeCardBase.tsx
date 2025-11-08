import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/designTokens';

interface CustomizeCardBaseProps {
	title: string;
	children: React.ReactNode;
	spacing?: 'compact' | 'default';
}

/**
 * Base container component for all customize cards.
 * Provides consistent styling (background, border, padding, title) 
 * while allowing unique controls to be passed as children.
 * 
 * @param spacing - 'compact' for 8px margin (panel contexts), 'default' for 24px margin
 */
const CustomizeCardBase: React.FC<CustomizeCardBaseProps> = ({ 
	title, 
	children,
	spacing = 'default'
}) => {
	return (
		<View style={[
			styles.container,
			spacing === 'compact' && styles.containerCompact
		]}>
			<Text style={styles.title}>{title}</Text>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative', // Allows absolute positioning of children
		marginBottom: spacing.cardMarginBottom,
		borderRadius: spacing.cardBorderRadius,
		borderWidth: 1,
		borderColor: colors.cardBorder,
		backgroundColor: colors.cardBackground,
		padding: spacing.cardPadding,
	},
	containerCompact: {
		marginBottom: 8, // Tighter spacing for panels
	},
	title: {
		fontSize: typography.cardTitle.fontSize,
		fontWeight: typography.cardTitle.fontWeight,
		color: colors.textSecondary,
		marginBottom: 8,
	},
});

export default CustomizeCardBase;

