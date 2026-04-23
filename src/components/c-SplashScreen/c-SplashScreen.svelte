<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import lottie from 'lottie-web';
  import { fade } from 'svelte/transition';
  import animationData from '../../lib/assets/splash-animation.json';

  const dispatch = createEventDispatcher();
  let container: HTMLElement;
  let isVisible = true;
  let isRevealing = false;

  onMount(() => {
    const anim = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: false, // Solo una vez para que sea más rápido
      autoplay: true,
      animationData: animationData
    });

    // Escuchamos exactamente cuando termina la animación
    anim.addEventListener('complete', () => {
      startReveal();
    });

    return () => anim.destroy();
  });

  const startReveal = () => {
    isRevealing = true;
    // El CSS transition dura 0.8s, esperamos a que termine para desmontar
    setTimeout(() => {
      isVisible = false;
      dispatch('complete');
    }, 800);
  };
</script>

{#if isVisible}
  <div 
    class="splash-screen" 
    class:reveal={isRevealing}
    out:fade={{ duration: 300 }}
  >
    <div class="lottie-container" bind:this={container}></div>
    <div class="liquid-layer"></div>
  </div>
{/if}

<style lang="scss">
  .splash-screen {
    position: fixed;
    inset: 0;
    background-color: var(--bg-main);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    overflow: hidden;
  }

  .lottie-container {
    width: 300px;
    height: 300px;
    z-index: 2;
    filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.2));
  }

  .liquid-layer {
    position: absolute;
    inset: 0;
    background: var(--bg-main);
    z-index: 1;
    clip-path: circle(150% at 50% 50%);
    transition: clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1);
  }

  .splash-screen.reveal .liquid-layer {
    clip-path: circle(0% at 50% 50%);
  }

  .splash-screen.reveal {
    filter: url(#liquid-filter);
  }
</style>

<svg style="position: absolute; width: 0; height: 0;">
  <filter id="liquid-filter">
    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="liquid" />
    <feComposite in="SourceGraphic" in2="liquid" operator="atop" />
  </filter>
</svg>