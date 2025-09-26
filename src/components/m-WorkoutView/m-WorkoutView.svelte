<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { sessionStore, type SessionState } from "../../lib/stores/sessionStore";
  import { timerStore, pauseTimer, startTimer, resetTimer } from "../../lib/stores/timerStore";
  import { workoutStore } from "../../lib/stores/workoutStore";
  import { getImages } from "../../lib/pexels";
  import ProgressBar from "../c-ProgressBar/c-ProgressBar.svelte";
  import Button from "../c-Button/c-Button.svelte";

  let session: SessionState;
  sessionStore.subscribe((value) => {
    session = value;
  });

  let progress = 0;
  let roundLabel = "";
  let images: string[] = [];
  let currentImageIndex = 0;

  // State for cross-fading backgrounds
  let bg1_url = "";
  let bg2_url = "";
  let bg1_opacity = 0;
  let bg2_opacity = 0;

  let imageChangeInterval: any;

  onMount(async () => {
    if ($workoutStore.theme && $workoutStore.theme.trim() !== '') {
      // Fetch a decent number of images for the session
      images = await getImages($workoutStore.theme, 20); 
      if (images.length > 0) {
        bg1_url = `url(${images[0]})`;
        bg1_opacity = 1;

        // Start changing images every 20 seconds
        imageChangeInterval = setInterval(changeImage, 10000);
      }
    }
  });

  onDestroy(() => {
    // Stop the image change interval when the component is destroyed
    if (imageChangeInterval) {
      clearInterval(imageChangeInterval);
    }
  });

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const changeImage = () => {
    if (images.length < 2) return; // We need at least two images to cycle

    currentImageIndex = (currentImageIndex + 1) % images.length;
    const nextImage = `url(${images[currentImageIndex]})`;

    // Simple cross-fade logic
    if (bg1_opacity > 0) {
      bg2_url = nextImage;
      bg1_opacity = 0;
      bg2_opacity = 1;
    } else {
      bg1_url = nextImage;
      bg1_opacity = 1;
      bg2_opacity = 0;
    }
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
  <!-- Background Image Containers -->
  <div class="background" style="background-image: {bg1_url}; opacity: {bg1_opacity};"></div>
  <div class="background" style="background-image: {bg2_url}; opacity: {bg2_opacity};"></div>

  <!-- UI Elements -->
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
    overflow: hidden;
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: opacity 1s ease-in-out;
    z-index: 0; /* Background layer */
  }
  
  /* Make sure all UI elements are on top of the background */
  .progress-bar-container,
  .top-info,
  .controls {
    position: relative;
    z-index: 1;
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
    color: white;
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