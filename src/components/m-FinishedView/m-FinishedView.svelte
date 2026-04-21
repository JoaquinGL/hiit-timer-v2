<script lang="ts">
  import { appStore } from "../../lib/stores/appStore";
  import { workoutStore } from "../../lib/stores/workoutStore";
  import Button from "../c-Button/c-Button.svelte";
  import { Trophy, Home } from "lucide-svelte";
</script>

<div class="finished-container">
  <div class="celebration-card">
    <div class="trophy-icon">
      <Trophy size={64} />
    </div>
    <h2>¡Entrenamiento Completado!</h2>
    <p>Has terminado con éxito la sesión <strong>{$workoutStore.name}</strong>.</p>
    
    <div class="stats">
      <div class="stat-item">
        <span class="label">Rondas</span>
        <span class="value">{$workoutStore.rounds}</span>
      </div>
      <div class="stat-item">
        <span class="label">Tiempo Total</span>
        <span class="value">{Math.floor(($workoutStore.workTime + $workoutStore.restTime) * $workoutStore.rounds / 60)} min</span>
      </div>
    </div>

    <Button on:click={() => appStore.set("config")}>
      <Home size={20} />
      Volver al Inicio
    </Button>
  </div>
</div>

<style lang="scss">
  .finished-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--bg-main);
  }

  .celebration-card {
    background: var(--bg-card);
    border-radius: 32px;
    padding: 3rem 2rem;
    text-align: center;
    width: 100%;
    max-width: 400px;
    box-shadow: var(--shadow);
    border: 1px solid rgba(255, 255, 255, 0.05);

    .trophy-icon {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
      color: white;
      box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
    }

    h2 {
      font-size: 1.75rem;
      font-weight: 800;
      margin-bottom: 1rem;
    }

    p {
      color: var(--text-muted);
      margin-bottom: 2rem;
      line-height: 1.6;
    }
  }

  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2.5rem;

    .stat-item {
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--text-muted);
        font-weight: 600;
      }

      .value {
        font-size: 1.25rem;
        font-weight: 800;
        color: var(--accent);
      }
    }
  }
</style>