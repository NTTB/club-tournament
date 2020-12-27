<script lang="ts">
  import TournamentHeader from "./_Header.svelte";
  import PageToggle from "./_PageToggle.svelte";
  import Toaster from "../../Shared/Toaster.svelte";
  import PlayerInfo from "../../Common/PlayerInfo.svelte";

  import PoolPlayerCard from "../../Common/PoolPlayerCard.svelte";
  import SearchCardPlayer from "../../Common/SearchCardPlayer.svelte";
  import SearchCardClub from "../../Common/SearchCardClub.svelte";
  import SearchCardCustomPlayer from "../../Common/SearchCardCustomPlayer.svelte";
  import { PlayerData } from "../../data-players";
  import { ClubData } from "../../data-clubs";
  import {
    getPlayersFromTournament,
    removePlayerFromTournament,
  } from "../../data/tournament-player-functions";
  import { findTournamentById } from "../../data/tournament";
  import type { TournamentPlayer } from "../../data/tournament-player";

  /**
   * Tournament Id
   */
  export let id: string;

  var tournamentPromise = findTournamentById(+id);
  var tournamentPlayersStore = getPlayersFromTournament(+id);
  let searchQuery = "";
  let searchInput: HTMLInputElement;
  $: searchTerms = [
    ...new Set(searchQuery.split(/\W+/).map((x) => x.trim().toLowerCase())),
  ];
  $: playerResults = PlayerData.filter(
    // Don't include players, that are already on the list
    (x) => !$tournamentPlayersStore.find((y) => y.nttbId === x.id)
  ).filter((x) => {
    return (
      searchTerms.every((t) => x.name.toLowerCase().includes(t)) ||
      searchTerms.every((t) => x.club.toLowerCase().includes(t)) ||
      x.id.toString(10) == searchQuery.trim()
    );
  });

  $: searchIsNumeric = searchQuery.trim().match(/\d+/);

  $: clubResults = ClubData.filter((x) =>
    x.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  $: showSearch = searchQuery.length > 2;
  $: showCustom = !searchIsNumeric;

  tournamentPlayersStore.subscribe(() => {
    searchQuery = "";
    if (searchInput) searchInput.focus();
  });

  let showCard = false;
  let selectedPlayer: TournamentPlayer = undefined;
  function onPlayerClick(player) {
    console.log("Selecting a player");
    selectedPlayer = player;
  }
  function closeToaster() {
    selectedPlayer = undefined;
  }

  function removePlayer() {
    removePlayerFromTournament(+id, selectedPlayer);
    selectedPlayer = undefined;
  }
  $: {
    showCard = !!selectedPlayer;
  }
</script>

<style>
  .container {
    --pageHeaderHeight: 125px;
    display: grid;
    grid-template-rows: 50px 1fr;
    grid-template-columns: 48px 1fr;
    grid-template-areas:
      "top-left search-row"
      "bottom-left player-list";
    height: calc(100vh - var(--pageHeaderHeight));
    max-height: calc(100vh - var(--pageHeaderHeight));
  }

  .top-left {
    grid-area: top-left;
    border-top: 1px solid var(--nttb-blue);
    border-right: 1px solid var(--nttb-blue);
  }
  .bottom-left {
    grid-area: bottom-left;
    border-right: 1px solid var(--nttb-blue);
  }
  .results {
    z-index: 1;
    position: fixed;
    background-color: white;
    box-shadow: 0 0 10px black;
    width: calc(100vw - 64px);
    max-height: calc(100vh - 186px);
    overflow: auto;
  }

  .player-list {
    grid-area: player-list;
    overflow: auto;

    box-sizing: border-box;
  }

  .search-row {
    border-top: 1px solid var(--nttb-blue);
    border-bottom: 1px solid var(--nttb-orange);
    grid-area: search-row;
    background-color: var(--nttb-orange);
    align-content: center;
    justify-content: center;
    padding: 8px;
    padding-bottom: unset;
  }

  h4 {
    border-bottom: 1px solid black;
    margin-bottom: 8px;
  }

  .search-input {
    width: 100%;
  }
</style>

{#await tournamentPromise}
  <TournamentHeader />
  <PageToggle {id} mode="players" />
  <div class="container">
    <p>Loading...</p>
  </div>
{:then tournament}
  <TournamentHeader title={tournament.name} />
  <PageToggle {id} mode="players" />
  <div class="container">
    <div class="top-left" />
    <div class="search-row">
      <input
        class="search-input"
        type="text"
        placeholder="Zoek op club, spelernaam of bondsnummer"
        bind:value={searchQuery}
        bind:this={searchInput} />

      {#if showSearch}
        <div class="results">
          {#each clubResults as club}
            <SearchCardClub {club} tournamentId={+id} />
          {/each}

          {#each playerResults as result}
            <SearchCardPlayer player={result} tournamentId={+id} />
          {/each}
          {#if showCustom}
            <SearchCardCustomPlayer />
          {/if}
        </div>
      {/if}
    </div>

    <div class="bottom-left" />
    <div class="player-list">
      {#each $tournamentPlayersStore as player}
        <PoolPlayerCard {player} on:click={() => onPlayerClick(player)} />
      {/each}
    </div>
  </div>
  {#if showCard}
    <Toaster on:backgroundClicked={closeToaster}>
      <h3 slot="title">{selectedPlayer.info.name}</h3>
      <h4>Speler informatie</h4>
      <PlayerInfo player={selectedPlayer} />
      <h4>Verwijder uit toernooi</h4>
      <button on:click={removePlayer}>Verwijder speler uit toernooi</button>
    </Toaster>
  {/if}
{/await}
