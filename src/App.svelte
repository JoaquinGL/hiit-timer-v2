<script lang="ts">
  import { appStore, type AppScreen } from "./lib/stores/appStore";
  import ConfigForm from "./components/m-ConfigForm/m-ConfigForm.svelte";
  import WorkoutView from "./components/m-WorkoutView/m-WorkoutView.svelte";
  import FinishedView from "./components/m-FinishedView/m-FinishedView.svelte";

  let screen: AppScreen;
  appStore.subscribe((value) => {
    screen = value;
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
