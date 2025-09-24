<script lang="ts">
  export let progress: number;
</script>

<div class="progress-bar">
  <div class="progress" style="width: {progress}%;" />
</div>

<style>
  .progress-bar {
    width: 100%;
    height: 10px;
    background-color: var(--paper-2);
    border-radius: 5px;
    overflow: hidden;
  }

  .progress {
    height: 100%;
    background-color: var(--accent);
    transition: width 0.2s ease-in-out;
  }
</style>
