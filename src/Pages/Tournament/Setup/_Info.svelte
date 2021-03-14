<script lang="ts">
  import MatchRules from "./Rules/MatchRules.svelte";
  import SetRules from "./Rules/SetRules.svelte";

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

<div class="field">
  <label for="name">Naam</label>
  <input
    id="name"
    type="text"
    placeholder="Toernooi naam"
    bind:value={tournament.name}
    on:change={() => dispatch("titleChanged", { title: tournament.name })}
    on:keyup={() => dispatch("titleChanged", { title: tournament.name })}
  />
</div>
<div class="field">
  <label for="table">Beschikbare speeltafels</label>
  <input type="number" id="table" bind:value={tournament.availableTables} />
</div>

<MatchRules rules={tournament.defaultPoolSettings.matchRules} />
<SetRules rules={tournament.defaultPoolSettings.setRules} />

<style>
  .field {
    max-width: 600px;
  }
  label {
    font-size: 18px;
    margin-top: 8px;
    margin-bottom: 4px;
  }
  input {
    width: 100%;
  }
</style>
