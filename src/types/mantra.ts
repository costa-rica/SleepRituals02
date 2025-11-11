/**
 * Types for Mantra meditation feature
 */

export interface MantraLine {
  index: number;
  text: string;
  audioFile: string;
}

export interface MantraData {
  theme: string;
  lines: MantraLine[];
}

// For tracking which line is currently active
export interface ActiveLineInfo {
  index: number;
  line: MantraLine;
}
