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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    box-shadow: var(--shadow);
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.3);
    }

    &:active {
      transform: scale(0.96) translateY(0);
    }

    &.primary {
      background: var(--accent-gradient);
      color: white;
      &:hover {
        filter: brightness(1.1);
        &::after {
          left: 120%;
        }
      }
      
      /* Efecto de brillo al pasar el ratón */
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(
          to right,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        transform: skewX(-25deg);
        transition: left 0.6s ease;
      }
    }

    &.secondary {
      background: var(--bg-card);
      color: var(--text-main);
      border: 1px solid rgba(255, 255, 255, 0.1);
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: var(--accent);
      }
    }

    &.danger {
      background: var(--danger);
      color: white;
      &:hover {
        filter: brightness(1.1);
      }
    }
  }
</style>