<script lang="ts">
  import type { Pool } from "../../../data/pool";
  import {
    RoundRobinPool_3_Players,
    RoundRobinPool_4_Players,
    RoundRobinPool_5_Players,
    RoundRobinPool_6_Players,
    RoundRobinPool_7_Players,
    RoundRobinPool_8_Players,
    RoundRobinPool_9_Players,
    RoundRobinPool_10_Players,
    RoundRobinPool_11_Players,
    RoundRobinPool_12_Players,
  } from "nttb-support";

  import PoolMatch from "./_PoolMatch.svelte";

  export let pool: Pool;

  function getPoolConfig(playerCount: number) {
    switch (playerCount) {
      case 3:
        return RoundRobinPool_3_Players;
      case 4:
        return RoundRobinPool_4_Players;
      case 5:
        return RoundRobinPool_5_Players;
      case 6:
        return RoundRobinPool_6_Players;
      case 7:
        return RoundRobinPool_7_Players;
      case 8:
        return RoundRobinPool_8_Players;
      case 9:
        return RoundRobinPool_9_Players;
      case 10:
        return RoundRobinPool_10_Players;
      case 11:
        return RoundRobinPool_11_Players;
      case 12:
        return RoundRobinPool_12_Players;
      default:
        throw new Error(`No known RoundRobinPool for ${playerCount} players`);
    }
  }

  var poolConfig = getPoolConfig(pool.players.length);
</script>

{#each poolConfig.matches as round, index}
  <h1>Round {index + 1}</h1>
  {#each round as match, matchIndex}
    {#if matchIndex != 0}
      <hr />
    {/if}
    <PoolMatch
      {matchIndex}
      homePlayer={pool.players[match.home - 1]}
      awayPlayer={pool.players[match.away - 1]} />
  {/each}
{/each}
