<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { sessionStore } from "../../lib/stores/sessionStore";
  import { timerStore, pauseTimer, startTimer, resetTimer } from "../../lib/stores/timerStore";
  import { workoutStore } from "../../lib/stores/workoutStore";
  import { getImages } from "../../lib/pexels";
  import ProgressBar from "../c-ProgressBar/c-ProgressBar.svelte";
  import Button from "../c-Button/c-Button.svelte";

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
  let isThemeCarouselActive = false;

  const setBackground = (newUrl: string) => {
    if (bg1_url === newUrl || bg2_url === newUrl) return;

    if (bg1_opacity > 0) {
      bg2_url = newUrl;
      bg1_opacity = 0;
      bg2_opacity = 1;
    } else {
      bg1_url = newUrl;
      bg1_opacity = 1;
      bg2_opacity = 0;
    }
  };

  const stopThemeCarousel = () => {
    if (imageChangeInterval) {
      clearInterval(imageChangeInterval);
      imageChangeInterval = null;
      isThemeCarouselActive = false;
    }
  };

  const startThemeCarousel = () => {
    if (isThemeCarouselActive || images.length === 0) return;
    
    isThemeCarouselActive = true;
    setBackground(`url(${images[currentImageIndex]})`);

    imageChangeInterval = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      setBackground(`url(${images[currentImageIndex]})`);
    }, 10000);
  };

  onMount(async () => {
    if ($workoutStore.theme && $workoutStore.theme.trim() !== '') {
      images = await getImages($workoutStore.theme, 20);
    }
    // The reactive logic below will handle the initial state.
  });

  onDestroy(() => {
    stopThemeCarousel();
  });

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Main reactive block
  $: {
    const workoutConfig = $workoutStore;
    const session = $sessionStore;
    
    // --- Progress Bar & Labels ---
    const totalTime = session.currentState === "work" ? workoutConfig.workTime : workoutConfig.restTime;
    progress = totalTime > 0 ? (session.currentTime / totalTime) * 100 : 0;

    if (session.currentState === 'work') {
      roundLabel = (workoutConfig.useRoundNames && workoutConfig.roundNames[session.currentRound - 1]) 
        ? workoutConfig.roundNames[session.currentRound - 1] 
        : `Round ${session.currentRound}`;
    } else if (session.currentState === 'rest') {
      const nextRound = session.currentRound;
      if (nextRound < workoutConfig.rounds) {
        roundLabel = (workoutConfig.useRoundNames && workoutConfig.roundNames[nextRound]) 
          ? `Next: ${workoutConfig.roundNames[nextRound]}` 
          : `Next: Round ${nextRound + 1}`;
      } else {
        roundLabel = 'Last Rest';
      }
    }

    // --- Background Logic ---
    if (session.currentState === 'work') {
      const roundBg = workoutConfig.roundBackgrounds && workoutConfig.roundBackgrounds[session.currentRound - 1];
      
      if (roundBg && roundBg.trim() !== '') {
        // Specific background for this round
        stopThemeCarousel();
        setBackground(`url(${roundBg})`);
      } else {
        // No specific background, use theme carousel
        startThemeCarousel();
      }
    } else if (session.currentState === 'rest') {
      // For rest, always use the theme carousel
      startThemeCarousel();
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
    <div class="timer">{formatTime($sessionStore.currentTime)}</div>
    <div class="round-info">
      <span class="state-label">{$sessionStore.currentState}</span>
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