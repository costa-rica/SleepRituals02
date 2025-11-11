# PROJECT_OVERVIEW.md

## Project Summary

**Sleep Rituals** is a React Native mobile application designed to help users wind down before sleep and start the next day with a clear, calm mindset.  
The app guides users through three key experiences:

1. **Good Times (Journal)** – Users respond to the question _“What are some things that made you happy today?”_ They can add as many entries as they wish, but must provide at least one before continuing.
2. **Breathing Exercise** – A guided breathing activity featuring subtle, calming animations to regulate the user’s rhythm.
3. **Mantra Meditation** – A collection of mantra audio files (.mp4) designed to help the user fall asleep peacefully.

---

## Core Architecture

### Tech Stack

- **Framework:** React Native (TypeScript)
- **Runtime:** Expo
- **Navigation:** React Navigation (native-stack)
- **State Management:** Redux Toolkit with redux-persist (AsyncStorage)
- **Architecture:** Classic navigation structure (not file-based routing)
- **Assets:** Located in `src/assets/expo-assets`

### Project Structure

All source files reside under the `/src` directory:

```
src/
├── app/
│   ├── App.tsx              # Main navigation container (with Redux Provider)
│   ├── index.tsx            # Entry point (defined in package.json)
│   └── welcome/             # Welcome flow screens (GoodTimes, Breathing, Mantra)
├── components/
│   ├── screen-frames/
│   │   └── ScreenFrame.tsx  # Shared layout component for all screens
│   ├── breathing/           # Breathing-specific components
│   ├── breathly/            # Breathing animation logic
│   └── panels/              # Slide-up panel components
├── constants/               # Constants (breathing exercises, design tokens)
├── hooks/                   # Custom React hooks (useBackgroundMusic)
├── utils/                   # Utility functions (breathingAudio.ts, musicManager.ts)
├── store/
│   ├── features/
│   │   ├── sound/
│   │   │   └── soundSlice.ts       # Audio settings (voice, music, volumes)
│   │   └── breathing/
│   │       └── breathingSlice.ts   # Breathing exercise state
│   ├── store.ts             # Root store configuration with redux-persist
│   ├── hooks.ts             # Typed Redux hooks (useAppSelector, useAppDispatch)
│   └── index.ts             # Barrel exports
├── assets/
│   └── expo-assets/
├── types/
│   └── navigation.ts        # Type-safe navigation types
```

The entry point is defined in `package.json` as:

```json
"main": "src/app/index.tsx"
```

---

## The ScreenFrame Component

The **ScreenFrame** (`/src/components/screen-frames/ScreenFrame.tsx`) acts as a **visual frame and layout foundation** for all major screens. It ensures stylistic consistency and provides a common background and navigation header.

### Key Behaviors

- Displays a background image from `src/assets/images/screen-frame/IllustrationBackground.png`.
- Uses a background color of `#0F1015` with a top illustration that fades toward the bottom.
- Hosts a **navigation-style header** that dynamically displays the screen title:
  - “Good Times”
  - “Breathing”
  - “Mantra”
- Implements a **visual wheel navigator** at the top of the screen that scrolls automatically as the user advances between screens (not user-scrollable).
- The current screen is opaque and centered; adjacent screens are partially transparent, giving the illusion of lateral progression.

Each child screen (GoodTimes, Breathing, Mantra) is wrapped within the ScreenFrame to inherit the background, wheel animation, and header.

---

## Screen Overview

| Screen         | Purpose                | Key UI Elements          | Notes                                           |
| -------------- | ---------------------- | ------------------------ | ----------------------------------------------- |
| **Good Times** | Journal reflection     | Text inputs, save button | Requires at least one entry before navigation   |
| **Breathing**  | Guided exercise        | Animated circle or pulse | Synchronized with inhale/exhale cycle           |
| **Mantra**     | Sleep audio meditation | Audio player (.mp4)      | May continue playing while the app is minimized |

---

## Navigation

Type-safe navigation follows the **screen props** approach.

- Navigation types defined in `src/types/navigation.ts`
- Screens use `NativeStackScreenProps<RootStackParamList, "ScreenName">`
- Example typed props: `GoodTimesProps`, `BreathingProps`, `MantraProps`

Configured via `createNativeStackNavigator` in `src/app/App.tsx`.

---

## Development & Commands

### Type Checking

```bash
npm run typecheck
npm run typecheck:watch
```

### Running the App

```bash
npm start      # Launch Expo dev server
npm run ios    # iOS simulator
npm run android # Android emulator
```

### Linting

```bash
npm run lint
```

---

## Design Reference

Design visuals can be found in `/docs/Figma/`:

- `01GoodTimesEmpty.png`
- `02GoodTimesFilled.png`
- `03BreathingNotStarted.png`
- `07Home.png`

Each represents a different screen state.  
These serve as references for layout proportions, font styling, and color gradients.

---

## Audio & Music System

### Background Music

The app features an advanced background music system with seamless crossfade looping:

**Architecture:**
- **MusicManager class** (`src/utils/musicManager.ts`) - Core playback engine
- **useBackgroundMusic hook** (`src/hooks/useBackgroundMusic.ts`) - React integration
- **Music files** (`src/assets/audio/music/`) - Optimized MP3 tracks (1-5 min, 128-192kbps)

**Key Features:**
- **Crossfade looping**: 6-second equal power crossfade for seamless infinite playback
- **Dynamic duration**: Works with any track length automatically
- **Ritual transitions**: Smooth fade in (2s) on start, fade out (4s) on end
- **Pause/Resume**: 1.5s fade out on pause, 2s fade in on resume with position preservation
- **Volume control**: Real-time adjustment without interrupting playback

**Equal Power Crossfade:**
```
Track A fadeout: cos(progress * π/2) 
Track B fadein:  sin(progress * π/2)
Result: Constant perceived volume throughout crossfade
```

### Voice Narration

**Breathing narrators** play synchronized voice cues ("Breathe in", "Hold", "Breathe out"):
- High-quality: Sira, Frederick (Eleven Labs)
- Temporarily hidden: Carla, Michael, Walter (awaiting audio replacement)
- Audio plays once per breathing phase step
- Volume controlled independently from music

**Mantra narrators** play sequential meditation lines:
- File-based system: Each line is a separate audio file (`line-01.mp3`, `line-02.mp3`, etc.)
- Currently: Calm theme with 8 lines, Sira narrator
- Playback flow: Text fades in → audio plays → text lingers → fades out → 1.5s gap → next line
- Loops 8 times by default (~8 minutes total)
- Pause/resume preserves position (resumes from current line, not line 1)
- Organized: `src/assets/mantras/{theme}/{narrator}/line-XX.mp3`
- Metadata: `src/assets/mantras/{theme}.json` contains line text and structure

**Audio Mixing:**

Critical iOS/Android configuration to allow narrator + music simultaneously:

```typescript
await Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
  shouldDuckAndroid: false,
  interruptionModeIOS: 1, // MIX_WITH_OTHERS
  interruptionModeAndroid: 1,
});
```

Must be set in all audio playback locations:
- `musicManager.ts`
- `BreathlyExercise.tsx`  
- `useMantraAudio.ts`

### Audio Cleanup Best Practices

To prevent duplicate audio tracks when settings change:

1. Use `isCancelled` flag pattern
2. Check flag after each async operation
3. Call `stopAsync()` before `unloadAsync()`
4. Wrap in try/catch with `.catch()` for graceful error handling

See `BreathlyExercise.tsx` for reference implementation.

---

## Future Enhancements

- **Database Migration:** Consider migrating from AsyncStorage to a database solution for larger-scale journal data.
- **Audio Library Expansion:** Add multiple mantra and ambient tracks with user selection.
- **Personalization:** Add optional daily reminders or analytics for mood tracking.
- **Cloud Sync:** Sync user data across devices via cloud storage.

---

## Summary

Sleep Rituals is designed as a soothing nightly ritual — a consistent, guided flow that blends journaling, breathing, and meditation into a single elegant mobile experience.  
The ScreenFrame component provides the visual cohesion and immersive design that ties these experiences together.
