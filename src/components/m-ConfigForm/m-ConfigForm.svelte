<script lang="ts">
  import { workoutStore } from "../../lib/stores/workoutStore";
  import { appStore } from "../../lib/stores/appStore";
  import { resetTimer, startTimer } from "../../lib/stores/timerStore";
  import PaperPanel from "../c-PaperPanel/c-PaperPanel.svelte";
  import RibbonTitle from "../c-RibbonTitle/c-RibbonTitle.svelte";
  import DottedRule from "../c-DottedRule/c-DottedRule.svelte";
  import Button from "../c-Button/c-Button.svelte";

  const handleStart = () => {
    resetTimer();
    startTimer();
    appStore.set("workout");
  };
</script>

<PaperPanel>
  <RibbonTitle title="HIIT Timer" />
  <div class="config-form">
    <label>
      <span>Workout Name</span>
      <input type="text" bind:value={$workoutStore.name} />
    </label>
    <DottedRule />
    <div class="time-inputs">
      <label>
        <span>Rounds</span>
        <input type="number" bind:value={$workoutStore.rounds} />
      </label>
      <label>
        <span>Work</span>
        <input type="number" bind:value={$workoutStore.workTime} />
      </label>
      <label>
        <span>Rest</span>
        <input type="number" bind:value={$workoutStore.restTime} />
      </label>
    </div>
    <DottedRule />
    <Button on:click={handleStart}>Start Workout</Button>
  </div>
</PaperPanel>

<style>
  .config-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .time-inputs {
    display: flex;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  input {
    width: 100%;
  }
</style>
