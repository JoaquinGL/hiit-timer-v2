import { writable } from 'svelte/store';

export type WorkoutState = 'work' | 'rest' | 'paused';

export interface SessionState {
  currentState: WorkoutState;
  currentTime: number;
  currentRound: number;
  roundName?: string;
}

export const sessionStore = writable<SessionState>({
  currentState: 'work',
  currentTime: 0,
  currentRound: 1,
});
