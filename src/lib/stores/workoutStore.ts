import { writable } from 'svelte/store';

export interface WorkoutConfig {
  name: string;
  rounds: number;
  workTime: number;
  restTime: number;
}

export const workoutStore = writable<WorkoutConfig>({
  name: 'My HIIT Workout',
  rounds: 10,
  workTime: 30,
  restTime: 15,
});
