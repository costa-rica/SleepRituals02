# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sleep Rituals is a React Native mobile app designed to prime users for sleep and the next day. The app has three key components:

1. **Journal (Good Times)**: Users respond to "What are some things that made you happy today?" - must enter at least one item before advancing
2. **Breathing Exercise**: Guided breathing using subtle animations
3. **Mantra Meditation**: Plays mantra audio files (.mp4) while user sleeps

Journal entries persist using Redux store (future versions may use a database).

## Tech Stack

- **Framework**: React Native with Expo (TypeScript)
- **Navigation**: React Navigation (native-stack)
- **State Management**: Redux Toolkit with redux-persist
- **Architecture**: Classic navigation structure (not Expo Router file-based routing)

### Custom Project Structure

This is NOT a standard Expo template. Key customizations:

- **Entry point**: Managed by `package.json` main property pointing to `src/app/index.tsx`
- **Assets location**: `src/assets/expo-assets` (not root-level assets/)
- **Source organization**: All source code in `src/` directory
- **App initialization**: `src/app/index.tsx` → `src/app/App.tsx` (main navigation container)

## Development Commands

### Type Checking

```bash
npm run typecheck          # Run type check once
npm run typecheck:watch    # Run type check in watch mode
```

### Running the App

```bash
npm start                  # Start Expo dev server (runs prestart type check)
npm run android            # Start on Android
npm run ios                # Start on iOS
npm run web                # Start on Web
```

### Linting

```bash
npm run lint               # Run ESLint
```

## Architecture

### Navigation Setup

**Type-safe navigation** using the "screen props" approach:

- Navigation types defined in `src/types/navigation.ts`
- `RootStackParamList` defines all routes and their params
- Each screen gets typed props via `NativeStackScreenProps<RootStackParamList, "ScreenName">`
- Example: `SplashScreenProps`, `GoodTimesProps`

Navigation is configured in `src/app/App.tsx` using `createNativeStackNavigator` with typed param list.

### Screen Organization

Screens are organized by feature area:

- `src/app/welcome/` - Welcome flow screens (Splash, GoodTimes, Breathing, Mantra)
- Screens are co-located with their feature flow for better organization

### Types

**Shared types** should be stored in the `src/types/` directory:

- `src/types/navigation.ts` - Navigation types for all screens (RootStackParamList, screen props)
- `src/types/breathly.ts` - (Future) Breathing exercise types when needed across multiple features
- Types used only within a single component/module should remain co-located with that component
- **Convention**: When a type is needed by more than one feature area, move it to `src/types/`

### Stores

**Redux state management** using Redux Toolkit with persistence:

- **Store location**: `src/store/`
- **Structure**: Feature-based slices following Redux Toolkit best practices
  - `src/store/features/sound/soundSlice.ts` - Audio settings (narrator voice/volume, music name/volume)
  - `src/store/features/breathing/breathingSlice.ts` - Breathing exercise state (exercise title/description, timing pattern, show instructions)
- **Configuration**: `src/store/store.ts` - Root store with redux-persist configuration using AsyncStorage
- **Typed hooks**: `src/store/hooks.ts` - Pre-typed `useAppDispatch` and `useAppSelector` hooks
- **Exports**: `src/store/index.ts` - Barrel exports for clean imports

**Redux persistence**:

- All state is persisted to AsyncStorage automatically
- Version-based migrations handle state shape changes
- Increment `version` in persist config when adding/removing state fields

**Usage example**:

```typescript
import {
	useAppSelector,
	useAppDispatch,
	updateBreatheExercise,
} from "../store";

const exerciseTitle = useAppSelector((state) => state.breathing.exerciseTitle);
const dispatch = useAppDispatch();
dispatch(
	updateBreatheExercise({
		/* ... */
	})
);
```

### Constants

**Constants** should be stored in the `src/constants/` directory:

- `src/constants/breathingExercises.ts` - Breathing exercise options

### Panels and Customize Cards

**Panels architecture** (`src/components/panels/`):

The panels directory contains reusable slide-up layouts and control components that provide user interaction interfaces:

- **Purpose**: Houses slide-up panels, player controls, and other interactive layouts
- **Examples**:
  - `PanelUpdateRitual.tsx` - Slide-up panel for updating ritual settings
  - `PanelPlayerControls.tsx` - Reusable player control buttons (play/pause, customize audio, settings)

**Customize Cards architecture** (`src/components/customize-cards/`):

Customize cards are standardized, reusable UI components for user preference selection. These cards provide consistent interfaces for adjusting app settings:

- **CustomizeCardSelector** (`CustomizeCardSelector.tsx`) - Selection interface for choosing between predefined options (e.g., breathing exercises)
- **CustomizeCardSlider** (planned) - Slider control for adjusting voice and music settings
- **CustomizeCardPlusMinus** (planned) - Plus/minus buttons for incrementing/decrementing values (e.g., duration)

**Integration with Redux state**:

User selections made through customize cards persist in Redux reducers:

- **Breathing settings** (`src/store/features/breathing/breathingSlice.ts`):
  - Exercise title and description
  - Timing patterns
  - Show instructions preference

- **Sound settings** (`src/store/features/sound/soundSlice.ts`):
  - Narrator voice selection and volume
  - Music name and volume
  - Other audio-related parameters

**Usage pattern**:

1. User interacts with customize cards in panels
2. Selection callbacks dispatch Redux actions
3. State updates persist via redux-persist
4. UI reflects updated preferences from Redux store

### Design Reference

Figma design screenshots are in `docs/Figma/`:

- `01GoodTimesEmpty.png` - Empty journal state
- `02GoodTimesFilled.png` - Journal with entries
- `03BreathingNotStarted.png` - Breathing exercise initial state
- `07Home.png` - Home screen

Refer to these for UI implementation details and variations.

### App Configuration

`app.json` points to custom asset locations:

- Icon: `./src/assets/expo-assets/icon.png`
- Splash: `./src/assets/expo-assets/splash-icon.png`
- Adaptive icon: `./src/assets/expo-assets/adaptive-icon.png`

## Important Notes

- **Type safety**: TypeScript strict mode is enabled. Pre-start hook runs `tsc --noEmit` to catch type errors before runtime
- **Navigation typing**: Always use typed navigation props from `src/types/navigation.ts` when adding new screens
- **Asset paths**: When adding assets, place them in `src/assets/expo-assets` and reference them correctly in `app.json`
- **Redux usage**: Always use typed hooks (`useAppSelector`, `useAppDispatch`) from `src/store` for type safety
- **State persistence**: When modifying Redux state shape, increment the version in `src/store/store.ts` and add a migration if needed

## Implementation Difficulty Index

This index helps Claude determine how challenging a proposed implementation would be within this project’s architecture and conventions. Claude should use this to assign a score from 0 to 10 when assessing new implementation requests.

**Scale:**

0: no need to change anything — functionality already exists  
1: minor modifications to existing files  
2: major modifications to existing files  
3–4: create new files  
5–6: create new files and folders  
7–8: change current structure and architecture (renaming, deleting, or repurposing)  
9: outside the range of convention given the technology, packages, and architecture in use  
10: impossible to accomplish
