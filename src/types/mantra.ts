/**
 * Types for Mantra meditation feature
 */

export interface MantraLine {
  start: string; // Format: "HH:MM:SS"
  end: string;   // Format: "HH:MM:SS"
  text: string;
}

export interface MantraAudioMetadata {
  duration: string;     // Format: "HH:MM:SS"
  sizeMB: number;
  channels: string;     // e.g., "Stereo"
  sampleRateHz: number;
  bitsPerSample: number;
}

export interface MantraData {
  mantraTheme: string;
  voice: string;
  audio: MantraAudioMetadata;
  lines: MantraLine[];
}

// For tracking which line is currently active
export interface ActiveLineInfo {
  index: number;
  line: MantraLine;
  startMs: number;
  endMs: number;
}
