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
  let roundLabel = "";

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

    if (session.currentState === 'work') {
      if (workoutConfig.useRoundNames && workoutConfig.roundNames[session.currentRound - 1]) {
        roundLabel = workoutConfig.roundNames[session.currentRound - 1];
      } else {
        roundLabel = `Round ${session.currentRound}`;
      }
    } else if (session.currentState === 'rest') {
      const nextRound = session.currentRound;
      if (nextRound < workoutConfig.rounds) {
        if (workoutConfig.useRoundNames && workoutConfig.roundNames[nextRound]) {
          roundLabel = `Next: ${workoutConfig.roundNames[nextRound]}`;
        } else {
          roundLabel = `Next: Round ${nextRound + 1}`;
        }
      } else {
        roundLabel = 'Last Rest';
      }
    }
  }
</script>

<div class="workout-view">
  <div class="progress-bar-container">
    <ProgressBar {progress} />
  </div>

  <div class="top-info">
    <div class="timer">{formatTime(session.currentTime)}</div>
    <div class="round-info">
      <span class="state-label">{session.currentState}</span>
      <span class="round-label">{roundLabel}</span>
    </div>
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
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden; /* To contain absolutely positioned elements */
  }

  .progress-bar-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .top-info {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    color: white; /* Assuming video background might be dark */
    text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
  }

  .timer {
    font-size: 4rem;
    font-weight: bold;
  }

  .round-info {
    text-align: right;
  }

  .state-label {
    display: block;
    font-size: 2rem;
    text-transform: capitalize;
    font-weight: bold;
  }

  .round-label {
    font-size: 1.5rem;
  }

  .controls {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 20px;
  }
</style>
