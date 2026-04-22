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
    *   `Training`: #2FA8B5
    *   `Rest`: #0EA5A6
    *   `Paused`: #F59E0B
*   **Typography:**
    *   Headings: Condensed, all-caps (e.g., Bebas, Oswald).
    *   Body: Slab/serif (e.g., Arvo, Roboto Slab).
    *   Timer: Monospace (e.g., Red Hat Mono, JetBrains Mono).
*   **Visual Motifs:** Ribbons, badges, dotted rules, ticket cards, micro-noise texture.

### Features

*   **Screens:**
    1.  **Home/Config:** A central panel for configuring workouts. Optimized for mobile with stacked inputs and improved spacing.
    2.  **Workout:** A minimal, full-screen timer display. Features a responsive timer font and "TRAINING" label.
    3.  **Finished:** A summary screen with workout statistics.
*   **State Management:** Svelte stores for workout and session state.
*   **PWA:** Offline support, installable, and screen-wake-lock.
*   **Background Generator:** A feature to generate background images from text prompts using Pexels API.

## Current Plan

### Phase 8: Mobile Optimization & UI Refinement (Current)

1.  **Responsive Config Form:** Stacked "Rounds/Work/Rest" inputs on mobile and vertical layout for personalized rounds to avoid horizontal scrolling.
2.  **Improved Spacing:** Increased padding and shadow for the main configuration card.
3.  **Workout View Refinement:** Added horizontal padding to the timer display and used responsive font sizing (`clamp`).
4.  **Label Update:** Changed "TRABAJO" to "TRAINING" for a more professional sports feel.

### Phase 7: Background Generator (Completed)
...