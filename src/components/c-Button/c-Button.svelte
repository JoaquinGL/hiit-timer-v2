<button class="c-Button" on:click>
  <slot />
</button>

<style lang="scss">
  .c-Button {
    background-color: var(--accent);
    color: var(--paper);
    border: none;
    padding: 1rem 2rem;
    font-size: 1.25rem;
    font-family: 'Bebas Neue', sans-serif;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--accent-2);
    }
  }
</style>
