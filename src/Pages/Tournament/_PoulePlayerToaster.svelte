<script lang="ts">
  import type { Poule } from "../../data/poule";
  import type { TournamentPlayer } from "../../data/tournament-player";

  import PlayerInfo from "../../Common/PlayerInfo.svelte";
  import Hint from "../../Common/Hint.svelte";

  import { createEventDispatcher } from "svelte";

  interface Events {
    moveToPoule: Poule;
  }

  const dispatch = createEventDispatcher<Events>();

  export let player: TournamentPlayer;
  export let poules: Poule[];
  export let selectedPoule: Poule;
</script>

<style>
  .tournament-actions {
    display: flex;
    flex-wrap: wrap;
  }
  .tournament-actions button {
    width: 48px;
    height: 48px;
    margin: 0;
    margin-right: 8px;
    margin-bottom: 8px;
  }

  h4 {
    border-bottom: 1px solid black;
    margin-bottom: 8px;
  }
</style>

<h4>Speler informatie</h4>
<PlayerInfo {player} />
<h4>Verplaats naar Poule</h4>
<div class="tournament-actions">
  {#each poules as poule}
    <button
      on:click={() => dispatch('moveToPoule', poule)}
      class:current={selectedPoule == poule}
      disabled={selectedPoule == poule}>
      {poule.name}:{poule.players.length}
    </button>
  {/each}
  {#if poules.length == 0}
    <Hint>
      Er zijn geen poules beschikbaar waar je de speler heen kan verplaatsen
    </Hint>
  {:else}
    <button
      on:click={() => dispatch('moveToPoule', undefined)}
      class:current={selectedPoule == undefined}
      disabled={selectedPoule == undefined}>RES</button>
  {/if}
</div>
