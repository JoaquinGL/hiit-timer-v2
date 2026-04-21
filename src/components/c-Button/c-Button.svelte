<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
</script>

<button class="c-Button {variant}" on:click>
  <slot />
</button>

<style lang="scss">
  .c-Button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1.25rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    box-shadow: var(--shadow);

    &:active {
      transform: scale(0.96);
    }

    &.primary {
      background: var(--accent-gradient);
      color: white;
      &:hover {
        filter: brightness(1.1);
      }
    }

    &.secondary {
      background: var(--bg-card);
      color: var(--text-main);
      border: 1px solid rgba(255, 255, 255, 0.1);
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }

    &.danger {
      background: var(--danger);
      color: white;
    }
  }
</style>