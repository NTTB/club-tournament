<script lang="ts">
  import TournamentHeader from "./_Header.svelte";
  import PouleRanking from "./_PouleRanking.svelte";

  import { findTournamentById } from "../../data/tournament";
  import { getPoulesFromTournament } from "../../data/poule";

  export let id: string;
  var tournamentPromise = findTournamentById(+id);
  var poules = getPoulesFromTournament(+id);
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
    {#each $poules as poule}
      <h2>Poule {poule.name}</h2>
      <PouleRanking {poule}></PouleRanking>
    {/each}
  </div>
{/await}
