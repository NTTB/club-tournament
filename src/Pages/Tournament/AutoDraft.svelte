<script lang="ts">
  import { get } from "svelte/store";
  import TournamentHeader from "./_Header.svelte";
  import PageToggle from "./_PageToggle.svelte";
  import NttbButton from "../../Common/NttbButton.svelte";
  import SuggestionDetails from "./_AutoDraftSuggestionHint.svelte";

  import {
    getPoolsFromTournament,
    createNewPool,
    deletePool,
    movePlayerToPool,
  } from "../../data/pool-functions";
  import { getPlayersFromTournament } from "../../data/tournament-player-functions";
  import { findTournamentById } from "../../data/tournament";
  import { TournamentsRoundRobinSuggestions as roundSuggestions } from "nttb-support";

  export let id: number;
  id = +id;
  var tournamentPromise = findTournamentById(id);
  var tournamentPlayerStore = getPlayersFromTournament(+id);
  var players = $tournamentPlayerStore;
  var selectedSuggestion = undefined;
  var draftMethod: "order" | "equal" = undefined;

  // Remove all suggestions that

  var suggestions = roundSuggestions
    .map((src) => {
      return {
        key: src.key,
        pools: src.pools,
        players: src.pools.reduce((pv, cv) => cv.slots + pv, 0),
      };
    })
    .filter((x) => x.players == players.length);

  function onStartClick() {
    const localPlayers = get(tournamentPlayerStore).sort((a, b) => {
      return b.info.rating - a.info.rating;
    });

    const chosenSuggestion = suggestions.find(
      (x) => x.key === selectedSuggestion
    );
    const desiredPools = chosenSuggestion.pools;
    var poolsToDelete = get(getPoolsFromTournament(id));

    // Delete existing pools
    poolsToDelete.forEach((x) => deletePool(x));

    // Create new pools
    desiredPools.forEach(() => createNewPool(id));

    var pools = get(getPoolsFromTournament(id));

    // Set the size of the pools
    pools.forEach((pool, i) => {
      const desiredPool = desiredPools[i];
      pool.maxPlayerCount = desiredPool.slots;
    });

    if (draftMethod == "order") {
      var playerIndex = 0;
      pools.forEach((pool, i) => {
        for (var j = 0; j < pool.maxPlayerCount; j++) {
          movePlayerToPool(localPlayers[playerIndex], pool);
          playerIndex++;
        }
      });
    }

    if (draftMethod == "equal") {
      localPlayers.forEach((player, i) => {
        const pool = pools[i % pools.length];
        movePlayerToPool(player, pool);
      });
    }

    window.location.hash = `/tournament/${id}/pool`;
  }
</script>

<style>
  .container {
    --pageHeaderHeight: 125px;
    height: calc(100vh - var(--pageHeaderHeight));
    padding: 8px 16px;
  }
</style>

{#await tournamentPromise}
  <TournamentHeader />
  <PageToggle id={id.toString()} mode="pool" />
  <div class="container">
    <p>Loading...</p>
  </div>
{:then tournament}
  <TournamentHeader title={tournament.name} />
  <PageToggle id={id.toString()} mode="pool" />

  <div class="container">
    <h2>Automatisch indelen</h2>

    <p>
      Via deze pagina kan je de spelers in het toernooi snel indelen. Bestaande
      indelingen zullen verloren gaan. Je kan altijd opnieuw automatisch
      indelen.
    </p>

    <h3>Mogelijke indelingen</h3>
    <div class="suggestions">
      {#each suggestions as suggestion}
        <div class="option">
          <input
            type="radio"
            name="auto-draft-pick"
            bind:group={selectedSuggestion}
            id={suggestion.key}
            value={suggestion.key} />
          <label for={suggestion.key}> {suggestion.key} </label>
          {#if suggestion.key == selectedSuggestion}
            <div class="show-more">
              <SuggestionDetails key={suggestion.key} {tournament} />
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <h3>Speler verdeling</h3>
    <div class="draft-method">
      <div class="option">
        <input
          type="radio"
          name="draft-method"
          id="draft-method-order"
          bind:group={draftMethod}
          value="order" />
        <label for="draft-method-order">Sterke spelers bij elkaar</label>
      </div>

      <div class="option">
        <input
          type="radio"
          name="draft-method"
          id="draft-method-equal"
          bind:group={draftMethod}
          value="equal" />
        <label for="draft-method-equal">Maak pools even sterk</label>
      </div>
    </div>

    <div style="margin-top: 20px">
      <NttbButton
        on:click={onStartClick}
        disabled={selectedSuggestion == undefined || draftMethod == undefined}>
        Deel opnieuw in
      </NttbButton>
    </div>
  </div>
{/await}
