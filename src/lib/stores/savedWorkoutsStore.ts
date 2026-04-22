import { writable } from 'svelte/store';
import type { WorkoutConfig } from './workoutStore';

const STORAGE_KEY = 'hiit_saved_workouts';

const getInitialWorkouts = (): WorkoutConfig[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savedWorkoutsStore = writable<WorkoutConfig[]>(getInitialWorkouts());

savedWorkoutsStore.subscribe(value => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
});

export function saveWorkout(workout: WorkoutConfig): boolean {
  let success = false;
  savedWorkoutsStore.update(list => {
    if (list.length >= 5) {
      success = false;
      return list;
    }
    success = true;
    // Clonamos para evitar referencias
    return [...list, JSON.parse(JSON.stringify(workout))];
  });
  return success;
}

export function deleteWorkout(index: number) {
  savedWorkoutsStore.update(list => list.filter((_, i) => i !== index));
}