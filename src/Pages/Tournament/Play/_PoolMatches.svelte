<script lang="ts">
  import type { Pool } from "../../../data/pool";

  import PoolMatch from "./_PoolMatch.svelte";

  export let pool: Pool;

  var rounds = pool.rounds;
</script>

{#each rounds as round, index}
  <h1>Round {index + 1}</h1>
  {#each round.matches as set, matchIndex}
    {#if matchIndex != 0}
      <hr />
    {/if}
    <PoolMatch
      {set}
      {matchIndex}
      homePlayer={pool.players[set.homePlayersIds[0] - 1]}
      awayPlayer={pool.players[set.awayPlayersIds[0] - 1]} />
  {/each}
{/each}
