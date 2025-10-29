# Voice Recordings

All voice recordings are generated from [ElevenLabs](https://elevenlabs.io).

## How Voice Narration Works

The breathing exercise uses voice narration synchronized with breathing phases. Each narrator has three audio files that map to step IDs in the `BreathlyExercise` component's `stepsMetadata`:

**Step ID Mapping:**
- `inhale` → `inhale.mp3` - "Breathe in"
- `afterInhale` → `hold.mp3` - "Hold"
- `exhale` → `exhale.mp3` - "Breathe out"
- `afterExhale` → `hold.mp3` - "Hold"

When a step begins during the breathing exercise, the corresponding audio file for the selected narrator plays once. Steps with duration 0 are skipped (no audio plays). This design is exercise-agnostic—any breathing pattern (4-4-4-4, 4-7-8, etc.) works with the same three audio files.

The audio file path is built as: `src/assets/audio/breathing/{narrator}/{stepId}.mp3`

## ElevenLabs Voice Parameters

## Sleep Rituals Calm Sira

- voice id: ryfLcxi3MKBqA5YXKg9Q

## Carla

- used in Breath Screen
- voice ID: l32B8XDoylOsZKiSdfhE
- linke: https://elevenlabs.io/app/voice-library?voiceId=l32B8XDoylOsZKiSdfhE
- speed: 0.95
- stability: 11%
- similarity: 75%
- Style Exaggeration: 49%
- Speaker boost: ON (white, nob to right)

## Micheal

- used in Breath Screen
- voice ID: p7QO4fjaXPnFTq8sWco5
- speed: 0.90
- stability: 67%
- similarity: 78%
- Style Exaggeration: None
- Speaker boost: ON (white, nob to right)

## Walter

- used in Breath Screen
- voice ID: kOqG1S0u0yzWPrpIo6i1
- speed: 1.00
- stability: 50%
- similarity: 75%
- Style Exaggeration: None
- Speaker boost: ON (white, nob to right)

## Sira

- used in Breath Screen
- voice ID: TBD
- speed: TBD
- stability: TBD
- similarity: TBD
- Style Exaggeration: TBD
- Speaker boost: TBD

## Frederick

- used in Breath Screen
- voice ID: TBD
- speed: TBD
- stability: TBD
- similarity: TBD
- Style Exaggeration: TBD
- Speaker boost: TBD

## Voice Assets Structure

Complete folder structure for breathing voice narration:

```
src/assets/audio/breathing/
├── carla/
│   ├── exhale.mp3
│   ├── hold.mp3
│   └── inhale.mp3
├── michael/
│   ├── exhale.mp3
│   ├── hold.mp3
│   └── inhale.mp3
├── sira/
│   ├── exhale.mp3
│   ├── hold.mp3
│   └── inhale.mp3
├── walter/
│   ├── exhale.mp3
│   ├── hold.mp3
│   └── inhale.mp3
└── frederick/
    ├── exhale.mp3
    ├── hold.mp3
    └── inhale.mp3
```

**Note:** Folder names must be lowercase to match the narrator name mapping in `src/utils/breathingAudio.ts`. The folder name for Michael is spelled "micheal" (not "michael") to match the actual folder structure.
