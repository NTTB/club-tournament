<script lang="ts">
  import TournamentHeader from "./_Header.svelte";
  import PageToggle from "./_PageToggle.svelte";
  import Hint from "../../Common/Hint.svelte";
  import {
    tournamentName,
    availableTables,
    pointsPerMatch,
    pointsPerSet,
    setsPerMatch,
  } from "../../data/tournament";
</script>

<style>
  .container {
    margin: 16px;
  }
  .field {
    max-width: 600px;
  }
  label {
    font-size: 18px;
    margin-top: 8px;
    margin-bottom: 4px;
  }
</style>

<TournamentHeader />
<PageToggle />
<div class="container">
  <div class="field">
    <label for="name">Naam</label>
    <input
      id="name"
      type="text"
      placeholder="Toernooi naam"
      bind:value={$tournamentName} />
  </div>
  <div class="field">
    <label for="table">Beschikbare speeltafels</label>
    <input type="number" id="table" bind:value={$availableTables} />
  </div>

  <div class="field">
    <label for="matchPointMethod">Aantal punten per wedstrijd</label>
    <select id="matchPointMethod" bind:value={$pointsPerMatch}>
      <option value={1}>1 punt per wedstrijd</option>
      <option value={2}>2 punten per gewonnen wedstrijd, 1 per overgave</option>
    </select>
  </div>

  <div class="field">
    <label for="gamesPerMatch">Aantal games per wedstrijd</label>
    <select id="gamesPerMatch" bind:value={$setsPerMatch}>
      <option value={3}>Best of 3</option>
      <option value={5}>Best of 5</option>
    </select>
  </div>

  <div class="field">
    <label for="pointsPerMatch">Game variant</label>
    <select id="pointsPerMatch" bind:value={$pointsPerMatch}>
      <option value={11}>Tot de 11</option>
      <option value={21}>Tot de 21</option>
    </select>
  </div>

  <Hint>
    <div>Alle wijzigingen worden automatisch opgeslagen</div>
    <div>Het is mogelijk om per poule afwijkende instellingen te gebruiken</div>
  </Hint>
</div>
