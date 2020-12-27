<script lang="ts">
  import type { Pool } from "../../data/pool";
  import type { TournamentPlayer } from "../../data/tournament-player";

  import PlayerInfo from "../../Common/PlayerInfo.svelte";
  import Hint from "../../Common/Hint.svelte";

  import { createEventDispatcher } from "svelte";

  interface Events {
    moveToPool: Pool;
  }

  const dispatch = createEventDispatcher<Events>();

  export let player: TournamentPlayer;
  export let pools: Pool[];
  export let selectedPool: Pool;
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
  {#each pools as pool}
    <button
      on:click={() => dispatch('moveToPool', pool)}
      class:current={selectedPool == pool}
      disabled={selectedPool == pool}>
      {pool.name}:{pool.players.length}
    </button>
  {/each}
  {#if pools.length == 0}
    <Hint>
      Er zijn geen poules beschikbaar waar je de speler heen kan verplaatsen
    </Hint>
  {:else}
    <button
      on:click={() => dispatch('moveToPool', undefined)}
      class:current={selectedPool == undefined}
      disabled={selectedPool == undefined}>RES</button>
  {/if}
</div>
