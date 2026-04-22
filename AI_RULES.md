# AI Development Rules - HIIT Timer

## Tech Stack
*   **Framework:** Svelte 5 (using the latest runes-based reactivity where applicable, though currently using Svelte 4/5 hybrid patterns).
*   **Language:** TypeScript for all logic and component scripts.
*   **Build Tool:** Vite for fast development and optimized production builds.
*   **State Management:** Svelte Stores (`writable`, `derived`) located in `src/lib/stores/`.
*   **Styling:** Scoped SCSS within components and global CSS variables in `src/app.css`.
*   **Icons:** Lucide Svelte for consistent iconography.
*   **External APIs:** Pexels API for dynamic background generation.
*   **Architecture:** Component-based architecture with a clear separation between UI components (`c-`) and module/page components (`m-`).

## Library Usage Rules
*   **State Management:** Always use Svelte stores for cross-component state. Do not use complex state management libraries like Redux or Vuex.
*   **Icons:** Use `lucide-svelte`. Do not install multiple icon libraries.
*   **Styling:** Prefer CSS variables for theme colors (`--ink`, `--paper`, `--accent`). Use SCSS for nesting and component-specific logic.
*   **Data Fetching:** Use the native `fetch` API. Avoid heavy libraries like Axios unless complex interceptors are required.
*   **Routing:** For this specific app, use the internal `appStore` for simple screen switching. Do not add a heavy router unless the app grows significantly.
*   **Animations:** Use Svelte's built-in `transition`, `in`, and `out` directives for UI animations.
*   **Utility Functions:** Place reusable logic in `src/lib/utils.ts` or specific service files like `src/lib/pexels.ts`.