<script lang="ts">
  import { workoutStore } from "../../lib/stores/workoutStore";
  import { appStore } from "../../lib/stores/appStore";
  import { resetTimer, startTimer } from "../../lib/stores/timerStore";
  import Button from "../c-Button/c-Button.svelte";
  import { Play, Settings2, Image as ImageIcon } from "lucide-svelte";

  const handleStart = () => {
    resetTimer();
    startTimer();
    appStore.set("workout");
  };

  let roundNamesInputs: string[] = [];
  let roundBackgroundsInputs: string[] = [];

  $: {
    if ($workoutStore.useRoundNames) {
      roundNamesInputs = Array.from({ length: $workoutStore.rounds }, (_, i) => $workoutStore.roundNames[i] || '');
      roundBackgroundsInputs = Array.from({ length: $workoutStore.rounds }, (_, i) => $workoutStore.roundBackgrounds[i] || '');
    }
  }

  const updateRoundData = () => {
    $workoutStore.roundNames = [...roundNamesInputs];
    $workoutStore.roundBackgrounds = [...roundBackgroundsInputs];
  };
</script>

<div class="config-container">
  <header class="header">
    <div class="icon-badge">
      <Settings2 size={32} />
    </div>
    <h1>HIIT <span>Timer</span></h1>
    <p>Configura tu sesión de entrenamiento</p>
  </header>

  <div class="form-card">
    <div class="input-group">
      <label for="workout-name">Nombre del entrenamiento</label>
      <input id="workout-name" type="text" bind:value={$workoutStore.name} placeholder="Ej: Quema Grasa" />
    </div>

    <div class="grid-inputs">
      <div class="input-group">
        <label for="rounds">Rondas</label>
        <input id="rounds" type="number" bind:value={$workoutStore.rounds} min="1" />
      </div>
      <div class="input-group">
        <label for="work">Training (s)</label>
        <input id="work" type="number" bind:value={$workoutStore.workTime} min="5" />
      </div>
      <div class="input-group">
        <label for="rest">Descanso (s)</label>
        <input id="rest" type="number" bind:value={$workoutStore.restTime} min="0" />
      </div>
    </div>

    <div class="input-group">
      <label for="theme">Tema visual (Pexels)</label>
      <div class="input-with-icon">
        <ImageIcon size={20} />
        <input id="theme" type="text" bind:value={$workoutStore.theme} placeholder="Ej: fitness, nature, urban" />
      </div>
    </div>

    <div class="toggle-group">
      <label class="switch">
        <input type="checkbox" bind:checked={$workoutStore.useRoundNames} />
        <span class="slider"></span>
      </label>
      <span class="toggle-label">Personalizar rondas</span>
    </div>

    {#if $workoutStore.useRoundNames}
      <div class="rounds-list">
        {#each Array($workoutStore.rounds) as _, i}
          <div class="round-item">
            <div class="round-header">
              <span class="round-number">{i + 1}</span>
              <span class="round-title">Configuración Ronda</span>
            </div>
            <div class="round-inputs">
              <input type="text" bind:value={roundNamesInputs[i]} on:input={updateRoundData} placeholder="Nombre de la ronda" />
              <input type="url" bind:value={roundBackgroundsInputs[i]} on:input={updateRoundData} placeholder="URL de imagen de fondo" />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="action-bar">
    <Button on:click={handleStart}>
      <Play size={20} fill="currentColor" />
      Empezar Entrenamiento
    </Button>
  </div>
</div>

<style lang="scss">
  .config-container {
    width: 100%;
    max-width: 500px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 2rem 1.25rem;
    overflow-y: auto;
  }

  .header {
    text-align: center;
    margin-bottom: 2.5rem;

    .icon-badge {
      width: 64px;
      height: 64px;
      background: var(--accent-gradient);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      box-shadow: 0 8px 20px rgba(56, 189, 248, 0.3);
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -1px;
      span { color: var(--accent); }
    }

    p {
      color: var(--text-muted);
      margin-top: 0.5rem;
    }
  }

  .form-card {
    background: var(--bg-card);
    border-radius: 24px;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    input {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 1.1rem;
      color: white;
      font-size: 1rem;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: var(--accent);
        background: rgba(15, 23, 42, 0.8);
      }
    }
  }

  .grid-inputs {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;

    @media (min-width: 400px) {
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
    }
  }

  .input-with-icon {
    position: relative;
    display: flex;
    align-items: center;
    
    :global(svg) {
      position: absolute;
      left: 1rem;
      color: var(--text-muted);
    }

    input {
      padding-left: 3rem;
      width: 100%;
    }
  }

  .toggle-group {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .toggle-label {
    font-weight: 600;
    color: var(--text-main);
  }

  .rounds-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 300px;
    overflow-y: auto;
    padding-right: 0.5rem;
    margin-top: 0.5rem;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 10px; }
  }

  .round-item {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: rgba(0, 0, 0, 0.25);
    padding: 1rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);

    .round-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .round-number {
      width: 28px;
      height: 28px;
      background: var(--accent);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 800;
      flex-shrink: 0;
    }

    .round-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .round-inputs {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      input {
        padding: 0.75rem;
        font-size: 0.9rem;
        border-radius: 10px;
      }
    }
  }

  .action-bar {
    margin-top: 2rem;
    padding-bottom: 2rem;
  }

  /* Switch Styles */
  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    input { opacity: 0; width: 0; height: 0; }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #334155;
    transition: .4s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 18px; width: 18px;
      left: 3px; bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }

  input:checked + .slider { background-color: var(--accent); }
  input:checked + .slider:before { transform: translateX(20px); }
</style>