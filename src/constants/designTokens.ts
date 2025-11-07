/**
 * Design Tokens for Sleep Rituals
 * 
 * Central source of truth for colors, spacing, and other design values
 * to ensure consistency across the app while maintaining a calming,
 * sleep-friendly aesthetic.
 */

export const colors = {
	// Card & Container Colors
	cardBackground: '#1E182E',
	cardBackgroundLifted: '#2A2038',  // Slightly lifted for selected states
	cardBorder: '#4E445C',
	cardBorderDisabled: '#312A43',
	
	// Text Colors (warm, muted tones to avoid blue light stimulation)
	textPrimary: '#F0EDF5',      // Main text, values (warm off-white)
	textSecondary: '#B5A8C8',    // Labels, subtitles (soft lavender-gray)
	textMuted: '#8B8B8B',        // Disabled or very subtle text
	textWhite: '#FFFFFF',        // Pure white (use sparingly)
	
	// Accent Colors
	accentPurple: '#8B7FB8',     // Primary buttons, highlights
	accentPurpleDark: '#7A6FA7', // Hover/pressed states
	
	// Background Colors
	backgroundDark: '#0F1015',   // Main app background
	backgroundPanel: '#0F1015',  // Panel backgrounds
	
	// Interactive States
	activeBackground: '#8B7FB8',
	inactiveBackground: 'rgba(255, 255, 255, 0.3)',
};

export const spacing = {
	// Card spacing
	cardPadding: 16,
	cardMarginBottom: 24,
	cardBorderRadius: 16,
	
	// Button spacing
	buttonBorderRadius: 12,
	buttonSize: 48,
	buttonGap: 12,
	
	// Panel spacing
	panelPaddingHorizontal: 24,
	panelPaddingTop: 32,
	panelPaddingBottom: 48,
	panelBorderRadius: 24,
};

export const typography = {
	// Card typography
	cardTitle: {
		fontSize: 14,
		fontWeight: '400' as const,
	},
	cardValue: {
		fontSize: 18,
		fontWeight: '500' as const,
	},
	
	// Panel typography
	panelTitle: {
		fontSize: 24,
		fontWeight: '600' as const,
	},
	
	// Button typography
	buttonText: {
		fontSize: 18,
		fontWeight: '600' as const,
	},
	buttonIcon: {
		fontSize: 24,
		fontWeight: '400' as const,
	},
};

