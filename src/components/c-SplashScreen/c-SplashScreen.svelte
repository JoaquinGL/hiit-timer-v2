<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import lottie from 'lottie-web';
  import { fade } from 'svelte/transition';
  import animationData from '../../lib/assets/splash-animation.json';

  const dispatch = createEventDispatcher();
  let container: HTMLElement;
  let isVisible = true;

  onMount(() => {
    const anim = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animationData
    });

    anim.addEventListener('complete', () => {
      isVisible = false;
      // Notificamos inmediatamente al padre
      dispatch('complete');
    });

    return () => anim.destroy();
  });
</script>

{#if isVisible}
  <div 
    class="splash-screen" 
    out:fade={{ duration: 200 }}
  >
    <div class="lottie-container" bind:this={container}></div>
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
  }

  .lottie-container {
    width: 260px;
    height: 260px;
    filter: drop-shadow(0 0 30px rgba(56, 189, 248, 0.1));
  }
</style>