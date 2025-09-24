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

  $: {
    if ($workoutStore.useRoundNames) {
      roundNamesInputs = Array.from({ length: $workoutStore.rounds }, (_, i) => $workoutStore.roundNames[i] || '');
    } else {
      $workoutStore.roundNames = [];
    }
  }

  const updateRoundNames = () => {
    $workoutStore.roundNames = [...roundNamesInputs];
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
    <label class="checkbox-label">
      <input type="checkbox" bind:checked={$workoutStore.useRoundNames} />
      <span>Name Rounds?</span>
    </label>
    {#if $workoutStore.useRoundNames}
      <div class="round-names-inputs">
        {#each Array($workoutStore.rounds) as _, i}
          <label>
            <span>Round {i + 1} Name</span>
            <input type="text" bind:value={roundNamesInputs[i]} on:input={updateRoundNames} />
          </label>
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

  .round-names-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    max-height: 200px; /* Or any other height */
    overflow-y: auto;
    padding: 0.5rem;
    border: 1px solid var(--muted);
    border-radius: 4px;
  }

  input {
    width: 100%;
  }
</style>
