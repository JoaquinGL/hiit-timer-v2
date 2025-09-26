# HIIT Timer Web App Blueprint

## Overview

This document outlines the plan for building a HIIT (High-Intensity Interval Training) timer web app with a retro-print editorial style. The application will be built using Svelte, Vite, and TypeScript, with a focus on a minimal and intuitive user experience.

## Project Outline

### Style and Design

*   **Aesthetics:** 1950s poster style with paper texture, stitched/dotted borders, ribbons, and badges.
*   **Color Palette:**
    *   `--ink`: #1C1D1F
    *   `--ink-2`: #2A2D30
    *   `--paper`: #EFE8D8
    *   `--paper-2`: #E6DFCF
    *   `--accent`: #2FA8B5
    *   `--accent-2`: #3C9FB0
    *   `--muted`: #94A3B8
    *   `Work`: #2FA8B5
    *   `Rest`: #0EA5A6
    *   `Paused`: #F59E0B
*   **Typography:**
    *   Headings: Condensed, all-caps (e.g., Bebas, Oswald).
    *   Body: Slab/serif (e.g., Arvo, Roboto Slab).
    *   Timer: Monospace (e.g., Red Hat Mono, JetBrains Mono).
*   **Visual Motifs:** Ribbons, badges, dotted rules, ticket cards, micro-noise texture.

### Features

*   **Screens:**
    1.  **Home/Config:** A central panel for configuring workouts.
    2.  **Workout:** A minimal, full-screen timer display. The layout is designed to be minimalistic to allow for a video background. The progress bar is at the top, the timer is in the top-left corner, the round information is in the top-right corner, and the control buttons are centered at the bottom.
    3.  **Finished:** A summary screen with workout statistics.
*   **State Management:** Svelte stores for workout and session state.
*   **PWA:** Offline support, installable, and screen-wake-lock.
*   **Firebase Integration:**
    *   Anonymous and email authentication.
    *   Firestore for storing workout data.
*   **i18n:** English and Spanish language support.
*   **Animations:** Smooth transitions and animations for a fluid user experience.
*   **Background Generator:** A feature to generate background images from text prompts.

## Current Plan

### Phase 7: Background Generator

1.  **Update `m-ConfigForm.svelte`:** Add an optional text input for a "theme".
2.  **Update `workoutStore`:** Add a `theme` property to the workout configuration.
3.  **Create Pexels Service:** Implement a service to fetch images from the Pexels API.
4.  **Update `m-WorkoutView.svelte`:** If a theme is provided, display background images from Pexels with a fade transition.

### Phase 6: Named Rounds

1.  **Update `workoutStore`:** Add a new `useRoundNames` boolean and a `roundNames` array to the store.
2.  **Update `m-ConfigForm.svelte`:** Add a checkbox to enable/disable round names, and a list of text inputs to enter the names for each round.
3.  **Update `m-WorkoutView.svelte`:** Display the current round name if it exists, otherwise display the round number.
4.  **Update `sessionStore`:** Add a `roundName` property to the session state.

### Phase 5: Minimalist Workout Screen Redesign (Completed)

1.  **Redesign `m-WorkoutView.svelte`:**
    *   The progress bar is now at the very top of the screen, spanning the full width.
    *   The timer is positioned in the top-left corner.
    *   The round/state information is in the top-right corner.
    *   Control buttons (`Pause`/`Start`, `Reset`) are centered at the bottom of the screen.
    *   The layout is managed with absolute positioning to free up the center of the screen for a potential video background.
    *   Text has a subtle text-shadow to ensure readability over various backgrounds.

### Phase 4: Workout Screen (Completed)

1.  **Create `sessionStore`:** A store to manage the state of the current workout session.
2.  **Update `m-WorkoutView`:** Implement the timer logic, progress bar, and display of the current state (work/rest, current round).
3.  **Create `c-ProgressBar` component:** A reusable component for the progress bar.
4.  **Create `m-FinishedView` component:** A new component for the workout finished screen.
5.  **Update `App.svelte`:** Add the logic to transition to the `finished` screen when the workout is complete.

### Phase 3: Start Workout (Completed)

1.  **Create `c-Button` component:** A reusable button component.
2.  **Add `appStore`:** A store to manage the application's current screen/view.
3.  **Add Start Button to `App.svelte`:** Add the button to the main screen, which will trigger the transition to the workout view.
4.  **Create `m-WorkoutView` component:** This will be the main component for the workout timer display.
5.  **Implement Screen Transition:** Use the `appStore` to switch between the configuration and workout views.

### Phase 2: Configuration Form (Completed)

1.  **Create `workoutStore`:** A Svelte store to manage the state of the workout configuration.
2.  **Create `m-ConfigForm` component:** This component will contain the form for setting the workout parameters (name, rounds, work/rest time).
3.  **Integrate `m-ConfigForm` into `App.svelte`:** Replace the placeholder text with the new component.
4.  **Style Form Elements:** Apply the retro-print style to the form inputs and labels.

### Phase 1: Project Scaffolding and Core Components (Completed)

1.  **Create Project Structure:** Set up the necessary folders and files for the project, including a `src/lib` directory for shared modules like stores and utilities, and a `src/components` directory for the Svelte components.
2.  **Install Dependencies:** Install `sass` for SCSS support.
3.  **Create Core Components:** Create the initial Svelte components for the main screens and UI elements, such as `PaperPanel`, `RibbonTitle`, and `DottedRule`.
4.  **Update `App.svelte`:** Replace the content of `App.svelte` with the new component structure.
5.  **Update `app.css`:** Replace the content of `app.css` with global styles and CSS variables.
6.  **Update `vite.config.ts`:** Update the Vite configuration to include any necessary plugins or settings.
7.  **Create `index.html`:** Update the `index.html` file to include the correct title and meta tags.
