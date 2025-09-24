<script lang="ts">
  import { sessionStore, type SessionState } from "../../lib/stores/sessionStore";
  import { timerStore, pauseTimer, startTimer, resetTimer } from "../../lib/stores/timerStore";
  import { workoutStore } from "../../lib/stores/workoutStore";
  import ProgressBar from "../c-ProgressBar/c-ProgressBar.svelte";
  import Button from "../c-Button/c-Button.svelte";

  let session: SessionState;
  sessionStore.subscribe((value) => {
    session = value;
  });

  let progress = 0;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  $: {
    const workoutConfig = $workoutStore;
    const totalTime = session.currentState === "work" ? workoutConfig.workTime : workoutConfig.restTime;
    if (totalTime > 0) {
      progress = (session.currentTime / totalTime) * 100;
    } else {
      progress = 0;
    }
  }
</script>

<div class="workout-view">
  <div class="timer-container">
    <div class="timer">{formatTime(session.currentTime)}</div>
    <ProgressBar {progress} />
  </div>

  <div class="state-info">
    <span class="state-label">{session.currentState}</span>
    <span class="round-label">Round {session.currentRound}</span>
  </div>

  <div class="controls">
    {#if $timerStore.state === "running"}
      <Button on:click={pauseTimer}>Pause</Button>
    {:else}
      <Button on:click={startTimer}>Start</Button>
    {/if}
    <Button on:click={resetTimer}>Reset</Button>
  </div>
</div>

<style>
  .workout-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .timer-container {
    text-align: center;
  }

  .timer {
    font-size: 4rem;
    font-weight: bold;
  }

  .state-info {
    margin-top: 20px;
    text-align: center;
  }

  .state-label {
    font-size: 2rem;
    text-transform: capitalize;
  }

  .round-label {
    font-size: 1.5rem;
    margin-top: 10px;
  }

  .controls {
    margin-top: 20px;
  }
</style>
