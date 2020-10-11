<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { ViewMode, viewMode } from "./data/app-state";
  const dispatch = createEventDispatcher();

  function switchToTournament() {
    viewMode.set(ViewMode.tournament);
  }

  function switchToPlayers() {
    viewMode.set(ViewMode.players);
  }

  function switchToPoule() {
    viewMode.set(ViewMode.poule);
  }
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    max-width: 600px;
    margin: 16px;
    margin-left: auto;
    margin-right: auto;
  }
  .option {
    padding: 8px 16px;
    border: 1px solid var(--nttb-blue);
    text-align: center;
    cursor: pointer;
  }

  .first {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .center {
    border-left: none;
    border-right: none;
  }
  .last {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .selected {
    color: var(--text-white);
    background-color: var(--nttb-blue);
  }
</style>

<div class="container">
  <div
    class="option first"
    class:selected={$viewMode == ViewMode.tournament}
    on:click={switchToTournament}>
    Toernooi
  </div>
  <div
    class="option center"
    class:selected={$viewMode == ViewMode.players}
    on:click={switchToPlayers}>
    Spelers
  </div>
  <div
    class="option last"
    class:selected={$viewMode == ViewMode.poule}
    on:click={switchToPoule}>
    Indeling
  </div>
</div>
