# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sleep Rituals is a React Native mobile app designed to prime users for sleep and the next day. The app has three key components:

1. **Journal (Good Times)**: Users respond to "Positive moments from today" with 20 rotating placeholder prompts - must enter at least one item before advancing
2. **Breathing Exercise**: Guided breathing using subtle animations with voice narration. Users can select from high-quality narrators (Sira, Frederick), and audio prompts play synchronized with each breathing phase (inhale, exhale, hold). Background music (Ocean Waves) plays with seamless crossfade looping.
3. **Mantra Meditation**: Sequential playback of mantra lines with gentle fade animations. Each line fades in before audio, lingers briefly, then fades out with 1.5s gaps between lines. Users complete 8 cycles (loops) through all lines.

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
- `src/constants/designTokens.ts` - **Design system tokens** for consistent styling:
  - **Colors**: `backgroundDark`, `cardBackground`, `cardBackgroundLifted`, `cardBorder`, `accentPurple`, etc.
  - **Spacing**: `cardPadding`, `cardMarginBottom`, `cardBorderRadius`, `panelPaddingTop`, etc.
  - **Typography**: Font sizes and weights for cards, buttons, body text
  - All customize cards and modals use these tokens for consistent visual treatment
  - Border width standard: 1px across all cards (selected and unselected states)

### Audio Assets

**Voice narration** for breathing exercises (`src/assets/audio/breathing/`):

- Audio files are organized by narrator name in lowercase (carla, michael, sira, walter, frederick)
- Each narrator folder contains three files: `inhale.mp3`, `exhale.mp3`, `hold.mp3`
- Files map to BreathlyExercise step IDs via `src/utils/breathingAudio.ts`:
  - `inhale` step → `inhale.mp3`
  - `afterInhale` step → `hold.mp3`
  - `exhale` step → `exhale.mp3`
  - `afterExhale` step → `hold.mp3`
- Audio plays once at the start of each breathing phase, synchronized with step changes
- **High-quality narrators**: Sira and Frederick use Eleven Labs recordings
- **Temporarily hidden**: Carla, Michael, Walter (commented out in `ModalSelectNarrator.tsx` until audio is improved)
- All audio files should be generated from ElevenLabs (see `docs/VOICE_RECORDINGS.md` for voice parameters)

**Background music** (`src/assets/audio/music/`):

- Music tracks for ambient background during rituals
- Current track: `ocean-waves.mp3` (1:27, 2MB, 192kbps stereo)
- Managed by `MusicManager` class with crossfade looping (see Audio Management section below)
- Files should be:
  - Format: MP3
  - Bitrate: 128-192kbps
  - Length: 1-5 minutes (optimized for looping)
  - Quality: High-quality, seamlessly loopable

**Mantra narration** (`src/assets/mantras/`):

- Organized by theme, then narrator: `mantras/{theme}/{narrator}/line-XX.mp3`
- Current implementation: Calm theme with Sira narrator (8 lines)
- Each theme has a JSON file: `mantras/{theme}.json` with line text and metadata
- Files are numbered sequentially: `line-01.mp3` through `line-08.mp3` (or however many lines)
- Playback is sequential with configurable gaps between lines (currently 1.5 seconds)
- File specs:
  - Format: MP3
  - Size: 15-75KB per line (very efficient)
  - Quality: Eleven Labs generated for consistency
- JSON structure:
```json
{
  "theme": "calm",
  "lines": [
    { "index": 1, "text": "I am safe.", "audioFile": "line-01.mp3" },
    ...
  ]
}
```

### Panels and Customize Cards

**Panels architecture** (`src/components/panels/`):

The panels directory contains reusable slide-up layouts and control components that provide user interaction interfaces:

- **Purpose**: Houses slide-up panels, player controls, and other interactive layouts
- **Examples**:
  - `PanelUpdateRitual.tsx` - Slide-up panel for updating ritual settings
  - `PanelPlayerControls.tsx` - Reusable player control buttons (play/pause, customize audio, settings)

**Customize Cards architecture** (`src/components/customize-cards/`):

Customize cards are standardized, reusable UI components for user preference selection. All cards use the design token system for consistent styling:

- **CustomizeCardBase** (`CustomizeCardBase.tsx`) - Base wrapper component providing consistent visual treatment
  - Accepts `spacing` prop: `'compact'` (8px margin for panels) or `'default'` (24px margin)
  - Provides title styling, border, background, padding via design tokens
- **CustomizeCardSelector** (`CustomizeCardSelector.tsx`) - Selection interface with chevron icon
  - Used for: Breathing exercise type selection
  - Shows current selection + chevron indicator
- **CustomizeCardSelectorSlider** (`CustomizeCardSelectorSlider.tsx`) - Selection with volume slider
  - Used for: Voice and Music selection with volume control
  - Supports `disabled` prop to gray out slider (e.g., when "No Voice" or "No Music" selected)
  - Slider position persists even when disabled
- **CustomizeCardPlusMinus** (`CustomizeCardPlusMinus.tsx`) - Plus/minus buttons for numeric values
  - Used for: Duration adjustment (cycles)
  - 40px buttons with -4px vertical margin for larger touch targets
  - Maintains consistent card height with selector cards

**Selectable Cards** (`src/components/cards/`):

- **SelectableCard** (`SelectableCard.tsx`) - Reusable component for selection modals
  - Fixed height support via `fixedHeight` prop
  - Selected state: Changes border color to `accentPurple`, background to `cardBackgroundLifted`
  - Consistent 1px border weight across all states
  - Used in: ModalSelectBreathingExercise, ModalSelectNarrator, ModalSelectMusic

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

### Audio Management

**Background Music System** (`src/utils/musicManager.ts` + `src/hooks/useBackgroundMusic.ts`):

The app features a sophisticated background music system with seamless crossfade looping:

**MusicManager Class** - Core music playback engine:
- **Crossfade looping**: Automatically loops tracks with 6-second equal power crossfade
  - Uses dual Audio.Sound instances for overlap
  - Crossfade starts at `trackDuration - 6000ms`
  - Equal power curves: `cos(progress * π/2)` for fade out, `sin(progress * π/2)` for fade in
  - Dynamic duration detection works with any track length
- **Ritual transitions**: 2-second fade in on start, 4-second fade out on end
- **Pause/Resume**: 1.5-second fade out on pause, 2-second fade in on resume
- **Position preservation**: Pause keeps track position, resume continues from same spot
- **Volume control**: Real-time volume adjustment without interrupting playback
- **Cleanup**: Proper async cleanup with cancellation checks to prevent overlapping instances

**useBackgroundMusic Hook** - React integration:
- Automatically starts music when ritual becomes active
- Respects "No Music" selection
- Syncs with pause/resume state
- Handles focus/blur (fades out when navigating away)
- Volume slider integration via Redux

**Mantra Narration System** (`src/components/mantra/useMantraAudio.ts`):

Sequential line-by-line playback with coordinated text and audio timing:

- **Playback flow per line:**
  1. Text fades in (500ms)
  2. Lead-in pause (300ms) 
  3. Audio plays for line
  4. Text lingers (800ms after audio ends)
  5. Text fades out (500ms)
  6. Gap before next line (1500ms blank screen)
  
- **Loop management:**
  - Plays all lines in sequence (e.g., 8 lines for Calm theme)
  - Loops continuously until session ends
  - Tracks loop count (default: 8 cycles total, ~8 minutes)
  - Each cycle takes ~1 minute
  
- **Pause/Resume:**
  - Saves current line position when paused
  - Resumes from beginning of saved line (not from Line 1)
  - Text fades out gracefully on pause
  
- **File loading:**
  - Dynamic theme-based JSON loading
  - Static requires for audio files (Metro bundler requirement)
  - Files organized by theme/narrator for easy scaling

**Audio Mixing Configuration**:

Critical for multiple audio sources (narrator + music) to play simultaneously:

```typescript
await Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
  shouldDuckAndroid: false,
  interruptionModeIOS: 1, // INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS
  interruptionModeAndroid: 1, // INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
});
```

This must be set in:
- `musicManager.ts` (background music)
- `BreathlyExercise.tsx` (breathing narrator)
- `useMantraAudio.ts` (mantra narrator)

**Audio Cleanup Pattern**:

To prevent duplicate audio tracks when settings change:

```typescript
useEffect(() => {
  let isCancelled = false;

  const playAudio = async () => {
    // Unload previous
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }
    if (isCancelled) return; // Check after async operation
    
    // Create and play new
    const { sound } = await Audio.Sound.createAsync(source);
    if (isCancelled) {
      await sound.unloadAsync(); // Clean up if cancelled
      return;
    }
    soundRef.current = sound;
    await sound.playAsync();
  };

  playAudio();

  return () => {
    isCancelled = true;
    if (soundRef.current) {
      soundRef.current.stopAsync().then(() => {
        soundRef.current?.unloadAsync();
      });
    }
  };
}, [dependencies]);
```

Key points:
- Use `isCancelled` flag to track cleanup
- Check flag after each async operation
- Call `stopAsync()` before `unloadAsync()`
- Handle errors gracefully with `.catch()`

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

### Ritual Lifecycle Management

**Pause-on-Blur Behavior**:

Both Breathing and Mantra rituals implement automatic pause when navigating away:

- **When user switches tabs mid-ritual**:
  - Ritual automatically pauses (animation, audio, timer)
  - Progress is preserved (cycle count, position)
  - Music fades out (4 seconds)
  
- **When user returns to paused ritual**:
  - Remains paused where they left off
  - User presses play to continue
  - Music fades in (2 seconds)

- **When user returns to completed ritual**:
  - Everything resets to beginning
  - Intro plays again
  - Fresh start

**Implementation Pattern**:

```typescript
useEffect(() => {
  const prevIsFocused = prevIsFocusedRef.current;
  prevIsFocusedRef.current = isFocused;

  // Screen just lost focus
  if (prevIsFocused && !isFocused) {
    if (isActive && !hasCompleted) {
      setIsPaused(true); // Pause ritual
    }
  }
  
  // Screen gained focus
  if (!prevIsFocused && isFocused) {
    if (hasCompleted) {
      // Reset everything for fresh start
    }
    // Otherwise preserve paused state
  }
}, [isFocused, hasCompleted, isActive]);
```

**Panel Pause Behavior**:

When Adjust Audio panel opens (via customize audio button):
- Everything pauses: animation, narrator, music, timer
- This ensures audio/visual stay in sync
- When panel closes, everything resumes from where it paused
- Implemented via `wasPausedBeforePanelRef` to preserve user's pause state

### Good Times Journal

**Prompt Rotation** (`src/app/welcome/GoodTimes.tsx`):

- 20 positive, action-oriented placeholder prompts (e.g., "Something that made you laugh")
- Prompts are shuffled once on component mount using `shuffleArray` utility
- Rotation persists during session but reshuffles on app restart
- Title: "Positive moments from today" (warm, less task-oriented)

## Important Notes

- **Type safety**: TypeScript strict mode is enabled. Pre-start hook runs `tsc --noEmit` to catch type errors before runtime
- **Navigation typing**: Always use typed navigation props from `src/types/navigation.ts` when adding new screens
- **Asset paths**: When adding assets, place them in `src/assets/expo-assets` and reference them correctly in `app.json`
- **Redux usage**: Always use typed hooks (`useAppSelector`, `useAppDispatch`) from `src/store` for type safety
- **State persistence**: When modifying Redux state shape, increment the version in `src/store/store.ts` and add a migration if needed
- **Audio mixing**: Always configure `interruptionModeIOS: 1` when creating Audio.Sound instances to allow narrator + music mixing
- **Async cleanup**: Use `isCancelled` pattern for all audio cleanup to prevent duplicate tracks
- **Music crossfade**: Don't modify crossfade logic without understanding equal power curves and dual-instance management

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
