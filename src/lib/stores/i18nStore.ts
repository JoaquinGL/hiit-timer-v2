import { writable, derived } from 'svelte/store';

export type Language = 'es' | 'en';

export const languageStore = writable<Language>('es');

const translations = {
  es: {
    subtitle: "Configura tu sesión de entrenamiento",
    share: "Compartir",
    clean: "Limpiar todo",
    workoutName: "Nombre del entrenamiento",
    rounds: "Rondas",
    training: "Training (s)",
    rest: "Descanso (s)",
    theme: "Tema visual (Pexels)",
    customizeRounds: "Personalizar rondas",
    roundDetail: "Detalle de Rondas",
    roundConfig: "Configuración Ronda",
    roundNamePlaceholder: "Nombre de la ronda",
    roundImagePlaceholder: "URL de imagen de fondo",
    startButton: "Empezar Entrenamiento",
    trainingBadge: "TRAINING",
    restBadge: "DESCANSO",
    prepare: "Prepárate...",
    lastRest: "Último descanso",
    finishedTitle: "¡Entrenamiento Completado!",
    finishedSub: "Has terminado con éxito la sesión",
    statsRounds: "Rondas",
    statsTotalTime: "Tiempo Total",
    backHome: "Volver al Inicio",
    confirmClean: "¿Estás seguro de que quieres limpiar toda la configuración?",
    copied: "¡Enlace copiado al portapapeles!"
  },
  en: {
    subtitle: "Configure your workout session",
    share: "Share",
    clean: "Clear all",
    workoutName: "Workout Name",
    rounds: "Rounds",
    training: "Training (s)",
    rest: "Rest (s)",
    theme: "Visual Theme (Pexels)",
    customizeRounds: "Customize rounds",
    roundDetail: "Round Details",
    roundConfig: "Round Configuration",
    roundNamePlaceholder: "Round name",
    roundImagePlaceholder: "Background image URL",
    startButton: "Start Workout",
    trainingBadge: "TRAINING",
    restBadge: "REST",
    prepare: "Get ready...",
    lastRest: "Last rest",
    finishedTitle: "Workout Completed!",
    finishedSub: "You have successfully finished the session",
    statsRounds: "Rounds",
    statsTotalTime: "Total Time",
    backHome: "Back to Home",
    confirmClean: "Are you sure you want to clear all settings?",
    copied: "Link copied to clipboard!"
  }
};

export const t = derived(languageStore, ($lang) => translations[$lang]);