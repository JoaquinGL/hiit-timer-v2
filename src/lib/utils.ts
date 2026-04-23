import type { WorkoutConfig } from './stores/workoutStore';
import LZString from 'lz-string';

// Mapeo de claves para reducir el tamaño del JSON
const keyMap: Record<string, string> = {
  name: 'n',
  rounds: 'r',
  workTime: 'w',
  restTime: 's',
  useRoundNames: 'u',
  roundNames: 'rn',
  roundBackgrounds: 'rb',
  theme: 't'
};

const reverseKeyMap: Record<string, string> = Object.fromEntries(
  Object.entries(keyMap).map(([k, v]) => [v, k])
);

export function encodeWorkout(config: WorkoutConfig): string {
  try {
    // Crear objeto con claves cortas
    const compact: any = {};
    for (const key in config) {
      if (keyMap[key]) {
        const value = (config as any)[key];
        // Solo incluir datos si no están vacíos para ahorrar espacio
        if (Array.isArray(value) && value.length === 0) continue;
        if (value === false || value === '') continue;
        compact[keyMap[key]] = value;
      }
    }
    
    const json = JSON.stringify(compact);
    // Comprimir usando LZString (Base64 optimizado para URLs)
    return LZString.compressToEncodedURIComponent(json);
  } catch (e) {
    console.error("Error encoding workout", e);
    return "";
  }
}

export function decodeWorkout(encoded: string): WorkoutConfig | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;
    
    const compact = JSON.parse(decompressed);
    const config: any = {
      name: '',
      rounds: 10,
      workTime: 30,
      restTime: 15,
      useRoundNames: false,
      roundNames: [],
      roundBackgrounds: [],
      theme: '',
    };

    for (const shortKey in compact) {
      const longKey = reverseKeyMap[shortKey];
      if (longKey) {
        config[longKey] = compact[shortKey];
      }
    }

    return config as WorkoutConfig;
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