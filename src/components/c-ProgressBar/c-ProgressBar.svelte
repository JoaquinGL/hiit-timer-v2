<script lang="ts">
  export let progress: number;
  export let color: string = 'var(--accent)';
</script>

<div class="progress-container">
  <div 
    class="progress-fill" 
    style="width: {progress}%; background-color: {color};"
  ></div>
</div>

<style>
  .progress-container {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
</style>