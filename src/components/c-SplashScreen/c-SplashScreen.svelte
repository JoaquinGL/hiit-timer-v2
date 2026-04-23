<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import lottie from 'lottie-web';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();
  let container: HTMLElement;
  let isVisible = true;
  let isRevealing = false;

  // Configuración de la animación (puedes cambiar el path por tu JSON de Lottie)
  onMount(() => {
    const anim = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://assets9.lottiefiles.com/packages/lf20_m6cuL6.json' // Placeholder
    });

    // Simulamos una duración inicial, luego tú me dirás cuánto quieres que dure
    setTimeout(() => {
      startReveal();
    }, 2500);

    return () => anim.destroy();
  });

  const startReveal = () => {
    isRevealing = true;
    setTimeout(() => {
      isVisible = false;
      dispatch('complete');
    }, 800); // Duración de la transición líquida
  };
</script>

{#if isVisible}
  <div 
    class="splash-screen" 
    class:reveal={isRevealing}
    out:fade={{ duration: 300 }}
  >
    <div class="lottie-container" bind:this={container}></div>
    
    <!-- Capa de transición líquida -->
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
    width: 200px;
    height: 200px;
    z-index: 2;
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

  /* Efecto de distorsión suave para simular líquido */
  .splash-screen.reveal {
    filter: url(#liquid-filter);
  }
</style>

<!-- Filtro SVG para el efecto líquido (opcional, añade realismo) -->
<svg style="position: absolute; width: 0; height: 0;">
  <filter id="liquid-filter">
    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="liquid" />
    <feComposite in="SourceGraphic" in2="liquid" operator="atop" />
  </filter>
</svg>