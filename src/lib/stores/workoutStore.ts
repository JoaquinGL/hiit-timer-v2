import { writable } from 'svelte/store';

export interface WorkoutConfig {
  name: string;
  rounds: number;
  workTime: number;
  restTime: number;
  useRoundNames: boolean;
  roundNames: string[];
  roundBackgrounds: string[];
  theme: string;
}

export const defaultWorkout: WorkoutConfig = {
  name: '',
  rounds: 10,
  workTime: 30,
  restTime: 15,
  useRoundNames: false,
  roundNames: [],
  roundBackgrounds: [],
  theme: '',
};

export const workoutStore = writable<WorkoutConfig>({ ...defaultWorkout, name: 'My HIIT Workout' });