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

  let roundNamesInputs: string[] = [];
  let roundBackgroundsInputs: string[] = [];

  $: {
    if ($workoutStore.useRoundNames) {
      roundNamesInputs = Array.from({ length: $workoutStore.rounds }, (_, i) => $workoutStore.roundNames[i] || '');
      roundBackgroundsInputs = Array.from({ length: $workoutStore.rounds }, (_, i) => $workoutStore.roundBackgrounds[i] || '');
    } else {
      $workoutStore.roundNames = [];
      $workoutStore.roundBackgrounds = [];
    }
  }

  const updateRoundData = () => {
    $workoutStore.roundNames = [...roundNamesInputs];
    $workoutStore.roundBackgrounds = [...roundBackgroundsInputs];
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
    <label>
      <span>Theme (optional)</span>
      <input type="text" bind:value={$workoutStore.theme} placeholder="e.g. 'nature, mountains'"/>
    </label>
    <DottedRule />
    <label class="checkbox-label">
      <input type="checkbox" bind:checked={$workoutStore.useRoundNames} />
      <span>Customize Rounds (Names & Backgrounds)?</span>
    </label>
    {#if $workoutStore.useRoundNames}
      <div class="round-customization-inputs">
        {#each Array($workoutStore.rounds) as _, i}
          <div class="round-input-group">
            <label>
              <span>Round {i + 1} Name</span>
              <input type="text" bind:value={roundNamesInputs[i]} on:input={updateRoundData} />
            </label>
            <label>
              <span>Round {i + 1} Background URL</span>
              <input type="url" bind:value={roundBackgroundsInputs[i]} on:input={updateRoundData} placeholder="https://.../image.gif"/>
            </label>
          </div>
        {/each}
      </div>
    {/if}
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

  .checkbox-label {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  input[type="checkbox"] {
    width: auto;
  }

  .round-customization-inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 250px;
    overflow-y: auto;
    padding: 1rem;
    border: 1px solid var(--muted);
    border-radius: 4px;
  }

  .round-input-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: end;
  }

  input {
    width: 100%;
  }
</style>
