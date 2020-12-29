<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";

  import { updateTournament } from "../../../data/tournament";
  import type { Tournament } from "../../../data/tournament";

  interface Events {
    titleChanged: { title: string };
  }

  export var tournament: Tournament;

  const dispatch = createEventDispatcher<Events>();

  onDestroy(() => {
    return updateTournament(tournament);
  });
</script>

<style>
  .field {
    max-width: 600px;
  }
  label {
    font-size: 18px;
    margin-top: 8px;
    margin-bottom: 4px;
  }
  input,
  select {
    width: 100%;
  }
</style>

<div class="field">
  <label for="name">Naam</label>
  <input
    id="name"
    type="text"
    placeholder="Toernooi naam"
    bind:value={tournament.name}
    on:change={() => dispatch('titleChanged', { title: tournament.name })}
    on:keyup={() => dispatch('titleChanged', { title: tournament.name })} />
</div>
<div class="field">
  <label for="table">Beschikbare speeltafels</label>
  <input type="number" id="table" bind:value={tournament.availableTables} />
</div>

<div class="field">
  <label for="matchPointMethod">Aantal punten per wedstrijd</label>
  <select id="matchPointMethod" bind:value={tournament.pointsPerMatch}>
    <option value={1}>1 punt per wedstrijd</option>
    <option value={2}>2 punten per gewonnen wedstrijd, 1 per overgave</option>
  </select>
</div>

<div class="field">
  <label for="gamesPerMatch">Aantal games per wedstrijd</label>
  <select id="gamesPerMatch" bind:value={tournament.setsPerMatch}>
    <option value={3}>Best of 3</option>
    <option value={5}>Best of 5</option>
    <option value={7}>Best of 7</option>
  </select>
</div>

<div class="field">
  <label for="pointsPerMatch">Game variant</label>
  <select id="pointsPerMatch" bind:value={tournament.pointsPerSet}>
    <option value={11}>Tot de 11</option>
    <option value={21}>Tot de 21</option>
  </select>
</div>
