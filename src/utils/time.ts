/**
 * Time conversion utilities for mantra audio sync
 */

/**
 * Convert time string in "HH:MM:SS" format to milliseconds
 * @param timeString - Time in format "HH:MM:SS" (e.g., "00:01:03")
 * @returns Time in milliseconds
 */
export function timeStringToMs(timeString: string): number {
  const parts = timeString.split(':');

  if (parts.length !== 3) {
    console.error(`Invalid time format: ${timeString}. Expected HH:MM:SS`);
    return 0;
  }

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);

  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    console.error(`Invalid time values in: ${timeString}`);
    return 0;
  }

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

/**
 * Convert milliseconds to time string in "HH:MM:SS" format
 * @param ms - Time in milliseconds
 * @returns Time string in format "HH:MM:SS"
 */
export function msToTimeString(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map(num => num.toString().padStart(2, '0'))
    .join(':');
}

/**
 * Format milliseconds as MM:SS for UI display
 * @param ms - Time in milliseconds
 * @returns Time string in format "MM:SS"
 */
export function msToMinutesSeconds(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
