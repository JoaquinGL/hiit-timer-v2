import { writable } from 'svelte/store';

export interface WorkoutConfig {
  name: string;
  rounds: number;
  workTime: number;
  restTime: number;
  useRoundNames: boolean;
  roundNames: string[];
}

export const workoutStore = writable<WorkoutConfig>({
  name: 'My HIIT Workout',
  rounds: 10,
  workTime: 30,
  restTime: 15,
  useRoundNames: false,
  roundNames: [],
});
