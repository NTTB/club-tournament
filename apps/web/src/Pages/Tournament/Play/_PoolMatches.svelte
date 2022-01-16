<script lang="ts">
  import type { MatchSet } from "../../../data/match-set";

  import type { Pool } from "../../../data/pool";
  import { updatePool } from "../../../data/pool-functions";
  import type { Tournament } from "../../../data/tournament";

  import PoolMatch from "./_PoolMatch.svelte";

  export let tournament: Tournament;
  export let pool: Pool;

  var rounds: MatchSet[][] = [];
  pool.sets.forEach((s) => {
    rounds[s.roundId] = rounds[s.roundId] || [];
    rounds[s.roundId].push(s);
  });

  function updateSet() {
    updatePool(pool);
  }
</script>

{#each rounds as round, index}
  <h1>Round {index + 1}</h1>
  {#each round as set, matchIndex}
    {#if matchIndex != 0}
      <hr />
    {/if}
    <PoolMatch {tournament} {pool} {set} on:update={updateSet} />
  {/each}
{/each}
