import { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { useAppSelector, useAppDispatch, setCurrentLineIndex, incrementLoopCount } from '../../store';
import { MantraData, MantraLine, ActiveLineInfo } from '../../types/mantra';

const GAP_BETWEEN_LINES_MS = 1500; // 1.5 seconds between mantra lines
const TEXT_FADE_IN_MS = 500; // Text fades in before audio
const TEXT_FADE_OUT_MS = 500; // Text fades out after audio
const TEXT_LEAD_IN_MS = 300; // Text appears 300ms before audio starts
const TEXT_LINGER_MS = 800; // Text lingers 800ms after audio ends

interface UseMantraAudioReturn {
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  activeLine: ActiveLineInfo | null;
  mantraData: MantraData | null;
  lineOpacity: Animated.Value;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seekToLine: (lineIndex: number) => Promise<void>;
  cleanup: () => Promise<void>;
}

export function useMantraAudio(): UseMantraAudioReturn {
  const dispatch = useAppDispatch();

  // Redux state
  const theme = useAppSelector((state) => state.mantra.theme);
  const voice = useAppSelector((state) => state.mantra.voice);
  const currentLineIndex = useAppSelector((state) => state.mantra.currentLineIndex);
  const narratorVolume = useAppSelector((state) => state.sound.narratorVoiceVolume);

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState<ActiveLineInfo | null>(null);
  const [mantraData, setMantraData] = useState<MantraData | null>(null);

  // Refs for audio playback
  const currentSound = useRef<Audio.Sound | null>(null);
  const playbackLoopRef = useRef<boolean>(false);
  const currentLineIndexRef = useRef<number>(0);
  const pausedAtLineRef = useRef<number>(0); // Track which line we paused at
  
  // Animated value for text opacity
  const lineOpacity = useRef(new Animated.Value(0)).current;

  // Load mantra data from JSON
  const loadMantraData = useCallback(() => {
    try {
      // Use require for static bundling
      let data: MantraData | null = null;

      // Support both 'calm' and 'sleep' for backwards compatibility (they're the same)
      if (theme === 'calm' || theme === 'sleep') {
        data = require('../../assets/mantras/calm.json');
      } else {
        console.error(`Mantra theme ${theme} not found`);
        setError(`Mantra theme "${theme}" is not available yet.`);
        return null;
      }

      setMantraData(data);
      return data;
    } catch (err) {
      console.error('Failed to load mantra JSON:', err);
      setError(`Failed to load mantra data for theme: ${theme}`);
      return null;
    }
  }, [theme]);

  // Get audio source for a specific line
  const getLineAudioSource = useCallback((lineIndex: number): any => {
    const voiceLower = voice.toLowerCase();
    const lineNum = (lineIndex + 1).toString().padStart(2, '0');

    // Map theme/voice combinations to their audio files
    // Support both 'calm' and 'sleep' for backwards compatibility
    if ((theme === 'calm' || theme === 'sleep') && voiceLower === 'sira') {
      const audioMap: Record<string, any> = {
        'line-01': require('../../assets/mantras/calm/sira/line-01.mp3'),
        'line-02': require('../../assets/mantras/calm/sira/line-02.mp3'),
        'line-03': require('../../assets/mantras/calm/sira/line-03.mp3'),
        'line-04': require('../../assets/mantras/calm/sira/line-04.mp3'),
        'line-05': require('../../assets/mantras/calm/sira/line-05.mp3'),
        'line-06': require('../../assets/mantras/calm/sira/line-06.mp3'),
        'line-07': require('../../assets/mantras/calm/sira/line-07.mp3'),
        'line-08': require('../../assets/mantras/calm/sira/line-08.mp3'),
      };
      return audioMap[`line-${lineNum}`] || null;
    }

    // Add more theme/voice combinations here as you create them
    return null;
  }, [theme, voice]);

  // Load mantra data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Configure audio mode to mix with background music
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
        interruptionModeIOS: 1, // INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS
        interruptionModeAndroid: 1, // INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
      });

      // Load mantra JSON data
      const data = loadMantraData();
      if (!data) {
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load mantra data:', err);
      setError('Failed to load mantra data');
      setIsLoading(false);
    }
  }, [loadMantraData]);

  // Play a single line with audio and text fade timing
  const playLine = useCallback(async (lineIndex: number): Promise<void> => {
    if (!mantraData || playbackLoopRef.current === false) return;

    const line = mantraData.lines[lineIndex];
    if (!line) return;

    try {
      // Update active line
      currentLineIndexRef.current = lineIndex;
      dispatch(setCurrentLineIndex(lineIndex));
      setActiveLine({
        index: lineIndex,
        line: line,
      });

      // 1. Fade in text
      await new Promise<void>((resolve) => {
        Animated.timing(lineOpacity, {
          toValue: 1,
          duration: TEXT_FADE_IN_MS,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }).start(() => resolve());
      });

      // 2. Brief pause after text is visible
      await new Promise(resolve => setTimeout(resolve, TEXT_LEAD_IN_MS));

      if (!playbackLoopRef.current) return;

      // 3. Get audio source and play
      const audioSource = getLineAudioSource(lineIndex);
      if (!audioSource) {
        console.warn(`Audio not found for line ${lineIndex + 1}`);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(audioSource, {
        volume: narratorVolume / 100,
        shouldPlay: true,
      });

      currentSound.current = sound;

      // 4. Wait for audio to finish playing
      await new Promise<void>((resolve) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            resolve();
          }
        });
      });

      if (!playbackLoopRef.current) return;

      // 5. Brief linger after audio ends
      await new Promise(resolve => setTimeout(resolve, TEXT_LINGER_MS));

      // 6. Fade out text
      await new Promise<void>((resolve) => {
        Animated.timing(lineOpacity, {
          toValue: 0,
          duration: TEXT_FADE_OUT_MS,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }).start(() => resolve());
      });

      // Clean up this line's audio
      await sound.unloadAsync();
      currentSound.current = null;

    } catch (err) {
      console.error(`Error playing line ${lineIndex + 1}:`, err);
    }
  }, [mantraData, getLineAudioSource, narratorVolume, dispatch, lineOpacity]);

  // Main playback loop - plays all lines sequentially with gaps
  const startPlaybackLoop = useCallback(async (startFromLine: number = 0) => {
    if (!mantraData) return;

    playbackLoopRef.current = true;

    while (playbackLoopRef.current) {
      // Play through all lines, starting from specified line
      for (let i = startFromLine; i < mantraData.lines.length; i++) {
        if (!playbackLoopRef.current) break;

        // Play the line
        await playLine(i);

        // Wait for gap between lines (unless it's the last line before loop)
        if (playbackLoopRef.current && i < mantraData.lines.length - 1) {
          await new Promise(resolve => setTimeout(resolve, GAP_BETWEEN_LINES_MS));
        }
      }

      // Completed full cycle through all lines
      if (playbackLoopRef.current) {
        dispatch(incrementLoopCount());
        // Small gap before restarting from beginning
        await new Promise(resolve => setTimeout(resolve, GAP_BETWEEN_LINES_MS));
      }
      
      // After first loop, always start from line 0
      startFromLine = 0;
    }
  }, [mantraData, playLine, dispatch]);

  // Start playing
  const play = useCallback(async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    // Resume from wherever we paused
    startPlaybackLoop(pausedAtLineRef.current);
  }, [isPlaying, startPlaybackLoop]);

  // Pause playback
  const pause = useCallback(async () => {
    playbackLoopRef.current = false;
    setIsPlaying(false);

    // Save current line for resume
    pausedAtLineRef.current = currentLineIndexRef.current;

    // Stop current sound if playing
    if (currentSound.current) {
      try {
        await currentSound.current.stopAsync();
        await currentSound.current.unloadAsync();
        currentSound.current = null;
      } catch (err) {
        console.error('Error stopping sound:', err);
      }
    }

    // Fade out text if visible
    Animated.timing(lineOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [lineOpacity]);

  // Seek to specific line
  const seekToLine = useCallback(async (lineIndex: number) => {
    if (!mantraData) return;

    // Stop current playback
    playbackLoopRef.current = false;
    
    if (currentSound.current) {
      try {
        await currentSound.current.stopAsync();
        await currentSound.current.unloadAsync();
        currentSound.current = null;
      } catch (err) {
        // Ignore cleanup errors
      }
    }

    // Update to new line index
    currentLineIndexRef.current = lineIndex;
    pausedAtLineRef.current = lineIndex; // Update pause position
    dispatch(setCurrentLineIndex(lineIndex));

    // Fade out text
    Animated.timing(lineOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Restart playback from new position if was playing
    if (isPlaying) {
      startPlaybackLoop(lineIndex);
    }
  }, [mantraData, isPlaying, dispatch, startPlaybackLoop, lineOpacity]);

  // Update volume when narrator volume slider changes
  useEffect(() => {
    const updateVolume = async () => {
      try {
        if (currentSound.current) {
          await currentSound.current.setVolumeAsync(narratorVolume / 100);
        }
      } catch (err) {
        console.error('Failed to update volume:', err);
      }
    };

    updateVolume();
  }, [narratorVolume]);

  // Cleanup function
  const cleanup = useCallback(async () => {
    playbackLoopRef.current = false;

    try {
      if (currentSound.current) {
        await currentSound.current.stopAsync();
        await currentSound.current.unloadAsync();
        currentSound.current = null;
      }
    } catch (err) {
      console.error('Failed to cleanup audio:', err);
    }
  }, []);

  // Load data on mount and when theme changes
  useEffect(() => {
    loadData();
    
    // Reset playback position when theme changes (fresh start)
    currentLineIndexRef.current = 0;
    pausedAtLineRef.current = 0;

    return () => {
      cleanup();
    };
  }, [theme, loadData, cleanup]); // Reload when theme changes (voice handled by getLineAudioSource)

  return {
    isLoading,
    error,
    isPlaying,
    activeLine,
    mantraData,
    lineOpacity,
    play,
    pause,
    seekToLine,
    cleanup,
  };
}
