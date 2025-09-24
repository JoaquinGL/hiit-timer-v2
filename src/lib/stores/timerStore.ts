import { writable, get } from 'svelte/store';
import { workoutStore } from './workoutStore';
import { sessionStore } from './sessionStore';
import { appStore } from './appStore';

export type TimerState = 'running' | 'paused' | 'finished';

export const timerStore = writable<{ state: TimerState }>({ state: 'paused' });

let interval: NodeJS.Timeout | null = null;

function tick() {
  sessionStore.update(session => {
    if (session.currentTime > 0) {
      return { ...session, currentTime: session.currentTime - 1 };
    } else {
      const workout = get(workoutStore);
      if (session.currentState === 'work') {
        return {
          ...session,
          currentState: 'rest',
          currentTime: workout.restTime
        };
      } else {
        if (session.currentRound < workout.rounds) {
          return {
            currentState: 'work',
            currentTime: workout.workTime,
            currentRound: session.currentRound + 1
          };
        } else {
          if (interval) clearInterval(interval);
          timerStore.set({ state: 'finished' });
          appStore.set('finished');
          return session;
        }
      }
    }
  });
}

export function startTimer() {
  timerStore.update(store => {
    if (store.state === 'paused') {
      interval = setInterval(tick, 1000);
      return { state: 'running' };
    }
    return store;
  });
}

export function pauseTimer() {
  timerStore.update(store => {
    if (store.state === 'running') {
      if (interval) clearInterval(interval);
      return { state: 'paused' };
    }
    return store;
  });
}

export function resetTimer() {
  if (interval) clearInterval(interval);
  timerStore.set({ state: 'paused' });
  const workout = get(workoutStore);
  sessionStore.set({
    currentState: 'work',
    currentTime: workout.workTime,
    currentRound: 1
  });
  appStore.set('config');
}
