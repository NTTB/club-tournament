<script lang="ts">
  import ViewToggle from "./_ViewToggle.svelte";
  import TournamentHeader from "../_Header.svelte";
  import PoolMatches from "./_PoolMatches.svelte";

  import { findTournamentById } from "../../../data/tournament";
  import { getPoolsFromTournament } from "../../../data/pool-functions";
  import { derived, get } from "svelte/store";

  export let id: string;
  export let poolId: string;

  var tournamentPromise = findTournamentById(+id);
  var pools$ = getPoolsFromTournament(+id);

  if (poolId === undefined) {
    const pools = get(pools$);
    if (pools?.length) {
      const firstPool = pools.find(() => true);
      poolId = firstPool.id.toString();
      window.location.hash = `#/tournament/${id}/matches/${poolId}`;
    }
  }

  const hasPoolId = poolId !== undefined;

  const poolRoutes$ = derived(pools$, (pools) => {
    return pools.map((x) => {
      return {
        id: x.id,
        name: `${x.name}:${x.players.length}`,
      };
    });
  });

  const activePool$ = derived(pools$, (pools) => {
    return pools.find((x) => x.id === +poolId);
  });
</script>

{#await tournamentPromise}
  <TournamentHeader />
  <ViewToggle mode="matches" {poolId} {id} />
  <div class="container">
    <p>Loading...</p>
  </div>
{:then tournament}
  <TournamentHeader title={tournament.name} />
  <ViewToggle mode="matches" {poolId} {id} />

  <div class="container">
    <div class="left">
      {#each $poolRoutes$ as poolRoute}
        <a class="pool-nav" href="/#/tournament/{id}/matches/{poolRoute.id}"
          >{poolRoute.name}</a
        >
      {/each}
    </div>
    <div class="right">
      {#if hasPoolId}
        <div class="right__header">
          Poule
          {$activePool$.name}
          - MK{$activePool$.players.length}
        </div>
        <div class="right__content">
          <PoolMatches pool={$activePool$} />
        </div>
      {:else}
        {#each $pools$ as pool}
          <h2>Poule {pool.name}</h2>
          <PoolMatches {pool} />
        {/each}
      {/if}
    </div>
  </div>
{/await}

<style>
  .container {
    display: grid;
    grid-template-columns: 49px 1fr;
    border-top: 1px solid var(--nttb-blue);
  }
  .container > .left {
    border-right: 1px solid var(--nttb-blue);
  }
  .pool-nav {
    display: block;
    height: 48px;
    width: 48px;
    line-height: 48px;
    text-align: center;
    font-weight: bold;
    color: black;
    background-color: rgb(244, 244, 244);
    border-bottom: 1px solid var(--nttb-orange);
  }

  .right__header {
    padding-left: 12px;
    font-size: larger;
    font-weight: bold;
    background-color: var(--nttb-orange);
    color: white;
    line-height: 48px;
    height: 48px;
    border-bottom: 1px solid var(--nttb-orange);
  }
  .right__content {
    padding: 8px;
  }
</style>
