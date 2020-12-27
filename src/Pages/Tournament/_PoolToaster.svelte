<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Pool } from "../../data/pool";
  import type { Tournament } from "../../data/tournament";

  interface Events {
    deletePool: void;
  }

  const dispatcher = createEventDispatcher<Events>();

  export let tournament: Tournament;
  export let selectedPool: Pool;

  function onDeleteClick() {
    dispatcher("deletePool");
  }

  function toggleCustomSettings() {
    if (selectedPool.settings) {
      selectedPool.settings = undefined;
    } else {
      selectedPool.settings = {
        pointsPerMatch: tournament.pointsPerMatch,
        pointsPerSet: tournament.pointsPerSet,
        setsPerMatch: tournament.setsPerMatch,
      };
    }
  }
</script>

<h4>Poule instellingen</h4>
<div class="row">
  <label for="maxPlayerCount">Maximaal aantal spelers</label>
  <input id="maxPlayerCount" bind:value={selectedPool.maxPlayerCount} />
</div>
<div class="row">
  <label><input
      type="checkbox"
      checked={!!selectedPool.settings}
      on:change={toggleCustomSettings} />
    Afwijkenede instellingen
  </label>
</div>
{#if selectedPool.settings}
  <div class="row">
    <label for="matchPointMethod">Aantal punten per wedstrijd</label>
    <select
      id="matchPointMethod"
      bind:value={selectedPool.settings.pointsPerMatch}>
      <option value={1}>1 punt per wedstrijd</option>
      <option value={2}>2 punten per gewonnen wedstrijd, 1 per overgave</option>
    </select>
  </div>
  <div class="row">
    <label for="gamesPerMatch">Aantal games per wedstrijd</label>
    <select id="gamesPerMatch" bind:value={selectedPool.settings.setsPerMatch}>
      <option value={3}>Best of 3</option>
      <option value={5}>Best of 5</option>
      <option value={7}>Best of 7</option>
    </select>
  </div>
  <div class="row">
    <label for="pointsPerMatch">Game variant</label>
    <select
      id="pointsPerMatch"
      bind:value={selectedPool.settings.pointsPerSet}>
      <option value={11}>Tot de 11</option>
      <option value={21}>Tot de 21</option>
    </select>
  </div>
{/if}
<h4>Poule acties</h4>
<button on:click={onDeleteClick}>Verwijder poule</button>
