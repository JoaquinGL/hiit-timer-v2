<script lang="ts">
  import { workoutStore, defaultWorkout, type WorkoutConfig } from "../../lib/stores/workoutStore";
  import { appStore } from "../../lib/stores/appStore";
  import { languageStore, t } from "../../lib/stores/i18nStore";
  import { savedWorkoutsStore, saveWorkout, deleteWorkout } from "../../lib/stores/savedWorkoutsStore";
  import { resetTimer, startTimer } from "../../lib/stores/timerStore";
  import { encodeWorkout, decodeWorkout, copyToClipboard } from "../../lib/utils";
  import Button from "../c-Button/c-Button.svelte";
  import Modal from "../c-Modal/c-Modal.svelte";
  import { Play, Settings2, Image as ImageIcon, Share2, Trash2, Languages, Save, FolderOpen, Trash, Check, Download } from "lucide-svelte";
  import { fade } from "svelte/transition";

  let showLoadModal = false;
  let showCopyFeedback = false;
  let showSaveFeedback = false;
  let importCode = "";

  const handleStart = () => {
    resetTimer();
    startTimer();
    appStore.set("workout");
  };

  const handleCleanAll = () => {
    if (confirm($t.confirmClean)) {
      workoutStore.set({ ...defaultWorkout });
    }
  };

  const toggleLanguage = () => {
    languageStore.update(l => l === 'es' ? 'en' : 'es');
  };

  const handleSave = () => {
    const config = { ...$workoutStore };
    if (!config.name.trim()) {
      config.name = $t.unnamedWorkout;
    }
    
    const success = saveWorkout(config);
    if (success) {
      showSaveFeedback = true;
      setTimeout(() => showSaveFeedback = false, 2000);
    } else {
      alert($t.maxReached);
    }
  };

  const handleShare = async () => {
    const encoded = encodeWorkout($workoutStore);
    const shareUrl = `${window.location.origin}${window.location.pathname}?w=${encoded}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `HIIT Timer: ${$workoutStore.name}`,
          text: $t.subtitle,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      const success = await copyToClipboard(shareUrl);
      if (success) {
        showCopyFeedback = true;
        setTimeout(() => showCopyFeedback = false, 2000);
      }
    }
  };

  const handleImport = () => {
    if (!importCode.trim()) return;
    
    let code = importCode;
    // Si es una URL, extraemos el parámetro 'w'
    if (code.includes('?w=')) {
      const url = new URL(code);
      code = url.searchParams.get('w') || "";
    }

    const decoded = decodeWorkout(code);
    if (decoded) {
      workoutStore.set(decoded);
      importCode = "";
      showLoadModal = false;
    } else {
      alert($t.importError);
    }
  };

  const handleLoad = (workout: WorkoutConfig) => {
    workoutStore.set(JSON.parse(JSON.stringify(workout)));
    showLoadModal = false;
  };

  const handleDeleteSaved = (index: number) => {
    if (confirm($t.deleteConfirm)) {
      deleteWorkout(index);
    }
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
  {#if showCopyFeedback}
    <div class="toast-feedback" transition:fade>
      <Check size={18} />
      <span>{$t.copied}</span>
    </div>
  {/if}

  {#if showSaveFeedback}
    <div class="toast-feedback save" transition:fade>
      <Save size={18} />
      <span>{$t.workoutSaved}</span>
    </div>
  {/if}

  <header class="header">
    <div class="icon-badge">
      <Settings2 size={32} />
    </div>
    <h1>HIIT <span>Timer</span></h1>
    <p>{$t.subtitle}</p>
  </header>

  <div class="utility-actions">
    <button class="util-btn lang" on:click={toggleLanguage} title="Cambiar idioma">
      <Languages size={18} />
      {$languageStore === 'es' ? 'English' : 'Español'}
    </button>
    <button class="util-btn share" on:click={handleShare} title={$t.share}>
      <Share2 size={18} />
      {$t.share}
    </button>
    <button class="util-btn save" on:click={handleSave} title={$t.save}>
      <Save size={18} />
      {$t.save}
    </button>
    <button class="util-btn load" on:click={() => showLoadModal = true} title={$t.load}>
      <FolderOpen size={18} />
      {$t.load}
    </button>
    <button class="util-btn clean" on:click={handleCleanAll} title={$t.clean}>
      <Trash2 size={18} />
      {$t.clean}
    </button>
  </div>

  <div class="main-card">
    <div class="input-group name-input">
      <label for="workout-name">{$t.workoutName}</label>
      <input 
        id="workout-name" 
        type="text" 
        bind:value={$workoutStore.name} 
        placeholder="Ej: Quema Grasa" 
      />
    </div>

    <div class="grid-inputs">
      <div class="input-group">
        <label for="rounds">{$t.rounds}</label>
        <input id="rounds" type="number" bind:value={$workoutStore.rounds} min="1" />
      </div>
      <div class="input-group">
        <label for="work">{$t.training}</label>
        <input id="work" type="number" bind:value={$workoutStore.workTime} min="5" />
      </div>
      <div class="input-group">
        <label for="rest">{$t.rest}</label>
        <input id="rest" type="number" bind:value={$workoutStore.restTime} min="0" />
      </div>
    </div>

    <div class="input-group">
      <label for="theme">{$t.theme}</label>
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
      <span class="toggle-label">{$t.customizeRounds}</span>
    </div>

    {#if $workoutStore.useRoundNames}
      <div class="rounds-divider"></div>
      <h3 class="section-title">{$t.roundDetail}</h3>
      <div class="rounds-list">
        {#each Array($workoutStore.rounds) as _, i}
          <div class="round-item">
            <div class="round-header">
              <span class="round-number">{i + 1}</span>
              <span class="round-title">{$t.roundConfig}</span>
            </div>
            <div class="round-inputs">
              <input type="text" bind:value={roundNamesInputs[i]} on:input={updateRoundData} placeholder={$t.roundNamePlaceholder} />
              <input type="url" bind:value={roundBackgroundsInputs[i]} on:input={updateRoundData} placeholder={$t.roundImagePlaceholder} />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="action-bar">
    <Button on:click={handleStart}>
      <Play size={20} fill="currentColor" />
      {$t.startButton}
    </Button>
  </div>
</div>

{#if showLoadModal}
  <Modal title={$t.load} on:close={() => showLoadModal = false}>
    <div class="load-modal-content">
      <div class="import-section">
        <h4>{$t.importTitle}</h4>
        <div class="import-input-group">
          <input 
            type="text" 
            bind:value={importCode} 
            placeholder={$t.importPlaceholder} 
          />
          <button class="import-btn" on:click={handleImport}>
            <Download size={18} />
          </button>
        </div>
      </div>

      <div class="divider"><span>{$t.savedWorkouts}</span></div>

      <div class="saved-list">
        {#if $savedWorkoutsStore.length === 0}
          <p class="empty-msg">{$t.noSavedWorkouts}</p>
        {:else}
          {#each $savedWorkoutsStore as workout, i}
            <div class="saved-item">
              <button class="load-action" on:click={() => handleLoad(workout)}>
                <span class="workout-name">{workout.name}</span>
                <span class="workout-info">{workout.rounds} rounds • {workout.workTime}s/{workout.restTime}s</span>
              </button>
              <button class="delete-action" on:click={() => handleDeleteSaved(i)} title={$t.deleteConfirm}>
                <Trash size={18} />
              </button>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </Modal>
{/if}

<style lang="scss">
  .config-container {
    width: 100%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    padding: 2rem 1.25rem;
    margin: 0 auto;
    position: relative;
  }

  .toast-feedback {
    position: fixed;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: var(--work);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 100px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
    z-index: 2000;

    &.save {
      background: var(--accent);
      box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4);
    }
  }

  .header {
    text-align: center;
    margin-bottom: 1.5rem;

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
      font-size: clamp(2rem, 5vw, 3rem);
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

  .utility-actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 2rem;

    .util-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
      padding: 0.6rem 1rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      &.lang:hover, &.share:hover, &.save:hover, &.load:hover {
        border-color: var(--accent);
        color: var(--accent);
      }

      &.clean:hover {
        border-color: var(--danger);
        color: var(--danger);
      }
    }
  }

  .main-card {
    background: var(--bg-card);
    border-radius: 32px;
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    width: 100%;
  }

  .name-input {
    margin-bottom: 0.5rem;
    
    input {
      text-align: left;
      font-size: 1.5rem;
      font-weight: 800;
      background: rgba(0, 0, 0, 0.2) !important;
      border-color: transparent !important;
      padding: 1.25rem !important;
      
      &:focus {
        border-color: var(--accent) !important;
        background: rgba(0, 0, 0, 0.3) !important;
      }
    }
  }

  .section-title {
    font-size: 1rem;
    font-weight: 800;
    margin: 0;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    label {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      text-align: left;
    }

    input {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.1rem;
      color: white;
      font-size: 1rem;
      transition: all 0.2s;
      width: 100%;

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

    @media (min-width: 450px) {
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
      left: 1.25rem;
      color: var(--text-muted);
    }

    input {
      padding-left: 3.5rem;
      width: 100%;
    }
  }

  .toggle-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .toggle-label {
    font-weight: 600;
    color: var(--text-main);
    font-size: 0.95rem;
  }

  .rounds-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0.5rem 0;
  }

  .rounds-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-right: 0;
  }

  .round-item {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: rgba(0, 0, 0, 0.25);
    padding: 1.25rem;
    border-radius: 20px;
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
      gap: 0.75rem;

      input {
        padding: 0.85rem;
        font-size: 0.9rem;
        border-radius: 12px;
      }
    }
  }

  .action-bar {
    margin-top: 2.5rem;
    padding-bottom: 2rem;
    width: 100%;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Load Modal Styles */
  .load-modal-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .import-section {
    h4 {
      margin: 0 0 0.75rem;
      font-size: 0.85rem;
      text-transform: uppercase;
      color: var(--text-muted);
      letter-spacing: 1px;
    }

    .import-input-group {
      display: flex;
      gap: 0.5rem;

      input {
        flex: 1;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 0.75rem 1rem;
        color: white;
        font-size: 0.9rem;
        &:focus { outline: none; border-color: var(--accent); }
      }

      .import-btn {
        background: var(--accent);
        border: none;
        color: white;
        width: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
        &:active { transform: scale(0.9); }
      }
    }
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--text-muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 700;
    &::before, &::after { content: ''; flex: 1; height: 1px; background: rgba(255, 255, 255, 0.1); }
  }

  .saved-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .empty-msg {
      text-align: center;
      color: var(--text-muted);
      padding: 1rem 0;
      font-size: 0.9rem;
    }
  }

  .saved-item {
    display: flex;
    align-items: stretch;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: transform 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateX(4px);
    }

    .load-action {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 1rem 1.25rem;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      text-align: left;

      .workout-name {
        font-weight: 700;
        font-size: 1rem;
        margin-bottom: 0.25rem;
      }

      .workout-info {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
    }

    .delete-action {
      padding: 0 1.25rem;
      background: rgba(239, 68, 68, 0.1);
      border: none;
      color: var(--danger);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;

      &:hover {
        background: var(--danger);
        color: white;
      }
    }
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