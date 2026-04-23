<script lang="ts">
  import { onMount } from "svelte";
  import { appStore, type AppScreen } from "./lib/stores/appStore";
  import { workoutStore } from "./lib/stores/workoutStore";
  import { decodeWorkout } from "./lib/utils";
  import ConfigForm from "./components/m-ConfigForm/m-ConfigForm.svelte";
  import WorkoutView from "./components/m-WorkoutView/m-WorkoutView.svelte";
  import FinishedView from "./components/m-FinishedView/m-FinishedView.svelte";
  import SplashScreen from "./components/c-SplashScreen/c-SplashScreen.svelte";

  let screen: AppScreen;
  let showSplash = true;

  appStore.subscribe((value) => {
    screen = value;
  });

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('w');
    if (sharedData) {
      const decoded = decodeWorkout(sharedData);
      if (decoded) {
        workoutStore.set(decoded);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  });

  const handleSplashComplete = () => {
    showSplash = false;
  };
</script>

{#if showSplash}
  <SplashScreen on:complete={handleSplashComplete} />
{/if}

<main class:is-workout={screen === 'workout'} class:hidden={showSplash}>
  {#if screen === "config"}
    <ConfigForm />
  {:else if screen === "workout"}
    <WorkoutView />
  {:else if screen === "finished"}
    <FinishedView />
  {/if}
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    min-height: 100vh;
    transition: opacity 0.5s ease;
  }

  main.hidden {
    opacity: 0;
    pointer-events: none;
  }

  main.is-workout {
    height: 100vh;
    overflow: hidden;
    align-items: center;
  }
</style>