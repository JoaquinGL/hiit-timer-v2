import { writable } from 'svelte/store';

export type AppScreen = 'config' | 'workout' | 'finished';

export const appStore = writable<AppScreen>('config');
