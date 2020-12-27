<script lang="ts">
  import TournamentHeader from "./_Header.svelte";
  import PoolRanking from "./_PoolRanking.svelte";

  import { findTournamentById } from "../../data/tournament";
  import { getPoolsFromTournament } from "../../data/pool-functions";

  export let id: string;
  var tournamentPromise = findTournamentById(+id);
  var pools = getPoolsFromTournament(+id);
</script>

<style>
  .container {
    margin: 16px;
  }
</style>

{#await tournamentPromise}
  <TournamentHeader />
  <div class="container">
    <p>Loading...</p>
  </div>
{:then tournament}
  <TournamentHeader title={tournament.name} />

  <div class="container">
    {#each $pools as pool}
      <h2>Poule {pool.name}</h2>
      <PoolRanking {pool} />
    {/each}
  </div>
{/await}
