import type { WorkoutConfig } from './stores/workoutStore';

export function encodeWorkout(config: WorkoutConfig): string {
  try {
    const json = JSON.stringify(config);
    // Usamos btoa con encodeURIComponent para manejar caracteres especiales
    return btoa(encodeURIComponent(json));
  } catch (e) {
    console.error("Error encoding workout", e);
    return "";
  }
}

export function decodeWorkout(encoded: string): WorkoutConfig | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (e) {
    console.error("Error decoding workout", e);
    return null;
  }
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
}