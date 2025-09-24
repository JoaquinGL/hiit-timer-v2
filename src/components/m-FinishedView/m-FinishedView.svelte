<script lang="ts">
  import { appStore } from "../../lib/stores/appStore";
  import { workoutStore } from "../../lib/stores/workoutStore";
  import Button from "../c-Button/c-Button.svelte";
  import PaperPanel from "../c-PaperPanel/c-PaperPanel.svelte";

  const handleFinish = () => {
    appStore.set("config");
  };
</script>

<PaperPanel>
  <div class="finished-view">
    <h2>Workout Finished!</h2>
    <p>Congratulations, you have completed the {$workoutStore.name} workout.</p>
    <Button on:click={handleFinish}>Finish</Button>
  </div>
</PaperPanel>

<style>
  .finished-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>
