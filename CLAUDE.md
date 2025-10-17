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
- **State Management**: Redux (planned for journal persistence)
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
- `src/app/welcome/` - Welcome flow screens (Splash, GoodTimes)
- Future screens for Breathing and Mantra will follow similar organization

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
- **Redux setup**: Not yet implemented but planned for journal persistence
