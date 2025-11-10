import { useState, useEffect, useRef, useCallback } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useAppSelector, useAppDispatch, setCurrentLineIndex, incrementLoopCount } from '../../store';
import { MantraData, MantraLine, ActiveLineInfo } from '../../types/mantra';
import { timeStringToMs } from '../../utils/time';

interface UseMantraAudioReturn {
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  activeLine: ActiveLineInfo | null;
  mantraData: MantraData | null;
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
  const musicVolume = useAppSelector((state) => state.sound.musicVolume);

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState<ActiveLineInfo | null>(null);
  const [mantraData, setMantraData] = useState<MantraData | null>(null);

  // Refs for audio instances
  const voiceSound = useRef<Audio.Sound | null>(null);
  const musicSound = useRef<Audio.Sound | null>(null);
  const positionUpdateInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load mantra data from JSON
  const loadMantraData = useCallback(() => {
    const jsonFileName = `sleep_rituals_${theme}_${voice}`;
    try {
      // Use require for static bundling (Metro doesn't support dynamic imports)
      // For now, only support calm/sira - can expand later
      let data: MantraData | null = null;

      if (jsonFileName === 'sleep_rituals_calm_sira') {
        data = require('../../assets/mantras/sleep_rituals_calm_sira.json');
      } else {
        console.error(`Mantra ${jsonFileName} not found`);
        setError(`Mantra theme "${theme}" with voice "${voice}" is not available yet.`);
        return null;
      }

      setMantraData(data);
      return data;
    } catch (err) {
      console.error('Failed to load mantra JSON:', err);
      setError(`Failed to load mantra data: ${jsonFileName}.json`);
      return null;
    }
  }, [theme, voice]);

  // Load audio files
  const loadAudio = useCallback(async () => {
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

      const audioFileName = `sleep_rituals_${theme}_${voice}`;

      // Use require for static bundling
      let audioSource;
      if (audioFileName === 'sleep_rituals_calm_sira') {
        audioSource = require('../../assets/audio/sleep_rituals_calm_sira.aif');
      } else {
        throw new Error(`Audio file for ${audioFileName} not found`);
      }

      // Load voice audio
      const { sound: voiceAudio } = await Audio.Sound.createAsync(
        audioSource,
        {
          shouldPlay: false,
          volume: narratorVolume / 100,
          isLooping: true, // Loop the mantra audio
        }
      );
      voiceSound.current = voiceAudio;

      // Set up playback status update callback
      voiceAudio.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.isPlaying) {
          updateActiveLine(status.positionMillis);
        }

        // Handle loop completion
        if (status.isLoaded && status.didJustFinish && status.isLooping) {
          dispatch(incrementLoopCount());
        }
      });

      // Load mantra data
      loadMantraData();

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load audio:', err);
      setError('Failed to load audio files');
      setIsLoading(false);
    }
  }, [theme, voice, narratorVolume, dispatch, loadMantraData]);

  // Update active line based on current position
  const updateActiveLine = useCallback((positionMs: number) => {
    if (!mantraData) return;

    const currentLine = mantraData.lines.find((line, index) => {
      const startMs = timeStringToMs(line.start);
      const endMs = timeStringToMs(line.end);
      return positionMs >= startMs && positionMs < endMs;
    });

    if (currentLine) {
      const lineIndex = mantraData.lines.indexOf(currentLine);
      if (lineIndex !== currentLineIndex) {
        dispatch(setCurrentLineIndex(lineIndex));
      }

      setActiveLine({
        index: lineIndex,
        line: currentLine,
        startMs: timeStringToMs(currentLine.start),
        endMs: timeStringToMs(currentLine.end),
      });
    }
  }, [mantraData, currentLineIndex, dispatch]);

  // Play audio with fade in
  const play = useCallback(async () => {
    try {
      if (voiceSound.current) {
        await voiceSound.current.playAsync();
        setIsPlaying(true);

        // Start position monitoring
        positionUpdateInterval.current = setInterval(async () => {
          const status = await voiceSound.current?.getStatusAsync();
          if (status?.isLoaded && status.isPlaying) {
            updateActiveLine(status.positionMillis);
          }
        }, 100); // Update every 100ms for smooth sync
      }
    } catch (err) {
      console.error('Failed to play audio:', err);
      setError('Failed to play audio');
    }
  }, [updateActiveLine]);

  // Pause audio with fade out
  const pause = useCallback(async () => {
    try {
      if (voiceSound.current) {
        await voiceSound.current.pauseAsync();
        setIsPlaying(false);

        // Stop position monitoring
        if (positionUpdateInterval.current) {
          clearInterval(positionUpdateInterval.current);
          positionUpdateInterval.current = null;
        }
      }
    } catch (err) {
      console.error('Failed to pause audio:', err);
      setError('Failed to pause audio');
    }
  }, []);

  // Seek to specific line
  const seekToLine = useCallback(async (lineIndex: number) => {
    try {
      if (!mantraData || !voiceSound.current) return;

      const line = mantraData.lines[lineIndex];
      if (!line) return;

      const startMs = timeStringToMs(line.start);
      await voiceSound.current.setPositionAsync(startMs);
      dispatch(setCurrentLineIndex(lineIndex));
      updateActiveLine(startMs);
    } catch (err) {
      console.error('Failed to seek to line:', err);
      setError('Failed to seek to line');
    }
  }, [mantraData, dispatch, updateActiveLine]);

  // Update volumes when Redux state changes
  useEffect(() => {
    const updateVolumes = async () => {
      try {
        if (voiceSound.current) {
          await voiceSound.current.setVolumeAsync(narratorVolume / 100);
        }
        if (musicSound.current) {
          await musicSound.current.setVolumeAsync(musicVolume / 100);
        }
      } catch (err) {
        console.error('Failed to update volumes:', err);
      }
    };

    updateVolumes();
  }, [narratorVolume, musicVolume]);

  // Cleanup function
  const cleanup = useCallback(async () => {
    try {
      if (positionUpdateInterval.current) {
        clearInterval(positionUpdateInterval.current);
        positionUpdateInterval.current = null;
      }

      if (voiceSound.current) {
        await voiceSound.current.unloadAsync();
        voiceSound.current = null;
      }

      if (musicSound.current) {
        await musicSound.current.unloadAsync();
        musicSound.current = null;
      }
    } catch (err) {
      console.error('Failed to cleanup audio:', err);
    }
  }, []);

  // Load audio on mount and when theme/voice changes
  useEffect(() => {
    loadAudio();

    return () => {
      cleanup();
    };
  }, [theme, voice]); // Only reload when theme or voice changes

  return {
    isLoading,
    error,
    isPlaying,
    activeLine,
    mantraData,
    play,
    pause,
    seekToLine,
    cleanup,
  };
}
