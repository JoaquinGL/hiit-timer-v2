<script lang="ts">
  import { onMount } from "svelte";
  import { appStore, type AppScreen } from "./lib/stores/appStore";
  import { workoutStore } from "./lib/stores/workoutStore";
  import { decodeWorkout } from "./lib/utils";
  import ConfigForm from "./components/m-ConfigForm/m-ConfigForm.svelte";
  import WorkoutView from "./components/m-WorkoutView/m-WorkoutView.svelte";
  import FinishedView from "./components/m-FinishedView/m-FinishedView.svelte";

  let screen: AppScreen;
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
        // Limpiamos la URL para que no se quede el churro de datos
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  });
</script>

<main>
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
    align-items: center;
    width: 100%;
    height: 100%;
  }
</style>