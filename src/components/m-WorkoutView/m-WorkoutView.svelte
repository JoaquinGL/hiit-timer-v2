<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { sessionStore } from "../../lib/stores/sessionStore";
  import { timerStore, pauseTimer, startTimer, resetTimer } from "../../lib/stores/timerStore";
  import { workoutStore } from "../../lib/stores/workoutStore";
  import { t } from "../../lib/stores/i18nStore";
  import { getImages } from "../../lib/pexels";
  import ProgressBar from "../c-ProgressBar/c-ProgressBar.svelte";
  import { Pause, Play, RotateCcw, Zap, Coffee } from "lucide-svelte";

  let progress = 0;
  let roundLabel = "";
  let images: string[] = [];
  let currentImageIndex = 0;

  let bg1_url = "";
  let bg2_url = "";
  let bg1_opacity = 0;
  let bg2_opacity = 0;

  let imageChangeInterval: any;
  let isThemeCarouselActive = false;
  let wakeLock: any = null;
  
  // Audio Context para generar pitidos sin archivos externos
  let audioCtx: AudioContext | null = null;

  const playBeep = () => {
    if (!$workoutStore.soundEnabled) return;
    
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // La 440Hz
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
  };

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLock = await (navigator as any).wakeLock.request('screen');
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLock !== null) {
      await wakeLock.release();
      wakeLock = null;
    }
  };

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

  const handleVisibilityChange = async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      await requestWakeLock();
    }
  };

  onMount(async () => {
    requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if ($workoutStore.theme && $workoutStore.theme.trim() !== '') {
      images = await getImages($workoutStore.theme, 20);
    }
  });

  onDestroy(() => {
    stopThemeCarousel();
    releaseWakeLock();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (audioCtx) audioCtx.close();
  });

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Lógica de avisos sonoros: Solo en fase 'work'
  $: {
    const session = $sessionStore;
    if (
      session.currentState === 'work' && 
      session.currentTime <= 3 && 
      session.currentTime > 0 && 
      $timerStore.state === 'running'
    ) {
      playBeep();
    }
  }

  $: {
    const workoutConfig = $workoutStore;
    const session = $sessionStore;
    const totalTime = session.currentState === "work" ? workoutConfig.workTime : workoutConfig.restTime;
    progress = totalTime > 0 ? (session.currentTime / totalTime) * 100 : 0;

    if (session.currentState === 'work') {
      roundLabel = (workoutConfig.useRoundNames && workoutConfig.roundNames[session.currentRound - 1]) 
        ? workoutConfig.roundNames[session.currentRound - 1] 
        : `${$t.rounds} ${session.currentRound}`;
      
      const roundBg = workoutConfig.roundBackgrounds && workoutConfig.roundBackgrounds[session.currentRound - 1];
      if (roundBg && roundBg.trim() !== '') {
        stopThemeCarousel();
        setBackground(`url(${roundBg})`);
      } else {
        startThemeCarousel();
      }
    } else {
      const nextRound = session.currentRound;
      roundLabel = nextRound < workoutConfig.rounds ? $t.prepare : $t.lastRest;
      startThemeCarousel();
    }
  }
</script>

<div class="workout-view" class:is-rest={$sessionStore.currentState === 'rest'}>
  <div class="background" style="background-image: {bg1_url}; opacity: {bg1_opacity};"></div>
  <div class="background" style="background-image: {bg2_url}; opacity: {bg2_opacity};"></div>
  <div class="overlay"></div>

  <div class="top-bar">
    <ProgressBar {progress} color={$sessionStore.currentState === 'work' ? 'var(--work)' : 'var(--rest)'} />
  </div>

  <div class="main-content">
    <div class="status-badge" class:work={$sessionStore.currentState === 'work'}>
      {#if $sessionStore.currentState === 'work'}
        <Zap size={16} fill="currentColor" />
        {$t.trainingBadge}
      {:else}
        <Coffee size={16} fill="currentColor" />
        {$t.restBadge}
      {/if}
    </div>

    <div 
      class="timer-display" 
      class:is-low-time={$sessionStore.currentState === 'work' && $sessionStore.currentTime <= 3 && $sessionStore.currentTime > 0}
    >
      {formatTime($sessionStore.currentTime)}
    </div>

    <div class="round-display">
      {roundLabel}
      <span class="round-count">{$sessionStore.currentRound} / {$workoutStore.rounds}</span>
    </div>
  </div>

  <div class="controls-bar">
    <button class="icon-btn secondary" on:click={resetTimer}>
      <RotateCcw size={24} />
    </button>
    
    {#if $timerStore.state === "running"}
      <button class="play-pause-btn" on:click={pauseTimer}>
        <Pause size={32} fill="currentColor" />
      </button>
    {:else}
      <button class="play-pause-btn" on:click={startTimer}>
        <Play size={32} fill="currentColor" />
      </button>
    {/if}

    <div class="spacer"></div>
  </div>
</div>

<style lang="scss">
  .workout-view {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #000;
    color: white;
  }

  .background {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: opacity 1.5s ease-in-out;
    z-index: 0;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.8) 100%);
    z-index: 1;
  }

  .top-bar {
    position: relative;
    z-index: 10;
    width: 100%;
  }

  .main-content {
    position: relative;
    z-index: 10;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem 1.5rem;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: var(--rest);
    border-radius: 100px;
    font-weight: 800;
    font-size: 0.85rem;
    letter-spacing: 1.5px;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);

    &.work {
      background: var(--work);
    }
  }

  .timer-display {
    font-size: clamp(4.5rem, 22vw, 8.5rem);
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    margin-bottom: 1.5rem;
    text-shadow: 0 10px 30px rgba(0,0,0,0.6);
    width: 100%;
    padding: 0 1rem;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &.is-low-time {
      color: var(--danger);
      animation: pulse-timer 1s infinite;
    }
  }

  @keyframes pulse-timer {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); text-shadow: 0 0 30px rgba(239, 68, 68, 0.6); }
    100% { transform: scale(1); }
  }

  .round-display {
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 90%;

    .round-count {
      font-size: 1rem;
      opacity: 0.7;
      font-weight: 400;
    }
  }

  .controls-bar {
    position: relative;
    z-index: 10;
    padding: 2.5rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .play-pause-btn {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: white;
    color: black;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    transition: transform 0.2s;

    &:active { transform: scale(0.9); }
  }

  .icon-btn {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(10px);
  }

  .spacer { width: 54px; }
</style>