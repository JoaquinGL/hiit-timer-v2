<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';

  export let title: string = '';
  const dispatch = createEventDispatcher();

  const close = () => dispatch('close');
</script>

<div class="modal-backdrop" on:click|self={close} transition:fade={{ duration: 200 }}>
  <div class="modal-content" transition:scale={{ duration: 200, start: 0.95 }}>
    <header class="modal-header">
      <h3>{title}</h3>
      <button class="close-btn" on:click={close}>
        <X size={24} />
      </button>
    </header>
    <div class="modal-body">
      <slot />
    </div>
  </div>
</div>

<style lang="scss">
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1.5rem;
  }

  .modal-content {
    background: var(--bg-card);
    width: 100%;
    max-width: 500px;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }

  .modal-header {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--accent);
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      transition: color 0.2s;
      &:hover { color: white; }
    }
  }

  .modal-body {
    padding: 1.5rem;
    max-height: 70vh;
    overflow-y: auto;
  }
</style>