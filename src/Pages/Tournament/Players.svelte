<script lang="ts">
  import { fade, slide } from "svelte/transition";

  import TournamentHeader from "./_Header.svelte";
  import PageToggle from "./_PageToggle.svelte";

  import PoulePlayerCard2 from "../../Common/PoulePlayerCard2.svelte";
  import SearchCardPlayer from "../../Common/SearchCardPlayer.svelte";
  import SearchCardClub from "../../Common/SearchCardClub.svelte";
  import SearchCardCustomPlayer from "../../Common/SearchCardCustomPlayer.svelte";
  import { PlayerData } from "../../data-players";
  import { ClubData } from "../../data-clubs";
  import {
    getPlayersFromTournament,
    removePlayerFromTournament,
  } from "../../data/tournament-player";
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
  function hidePlayerCard() {
    selectedPlayer = undefined;
  }

  function removePlayer(){
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
    box-shadow: 0 0 50px black;
    width: calc(100% - 32px);
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

  .card.background {
    background: rgba(0, 0, 0, 20%);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
  }
  .card.foreground {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 70vh;
    background-color: white;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  .card__header {
    padding: 6px;
    padding-top: 0;
    border-bottom: 2px solid var(--text-dimmed-black);
  }
  .card__header .slider {
    grid-area: slider;
    margin-top: 6px;
    margin-bottom: 2px;
    margin-left: 96px;
    margin-right: 96px;
    height: 5px;
    border-radius: 5px;
    background-color: var(--text-dimmed-black);
  }

  .card__header .title {
    margin: 12px 0;
    padding-left: 16px;
    font-weight: bold;
    font-size: large;
  }

  .card__content {
    padding: 12px;
  }
  .sub-header {
    font-size: large;
    border-bottom: 1px solid black;
    font-weight: bold;
    margin: 12px 0;
  }
  .player-info {
    display: grid;
    grid-template-columns: 80px 1fr;
  }

  .tournament-actions {
    display: flex;
    flex-wrap: wrap;
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
        <PoulePlayerCard2 {player} on:click={() => onPlayerClick(player)} />
      {/each}
    </div>
  </div>
  {#if showCard}
    <div
      transition:fade={{ duration: 200 }}
      class="card background"
      on:click={hidePlayerCard} />
    <div transition:slide={{ duration: 200 }} class="card foreground">
      <div class="card__header">
        <div class="slider" />
        <div class="title">{selectedPlayer.info.name}</div>
      </div>
      <div class="card__content">
        <div class="sub-header">Speler informatie</div>
        <div class="player-info">
          <div class="label">Club</div>
          <div class="value">{selectedPlayer.info.club}</div>
          <div class="label">Rating</div>
          <div class="value">{selectedPlayer.info.rating}</div>
          <div class="label">Niveau</div>
          <div class="value">{selectedPlayer.info.class}</div>
        </div>
        <div class="sub-header">Verwijder uit toernooi</div>
        <div class="tournament-actions">
          <button on:click={removePlayer}>Verwijder speler uit toernooi</button>
        </div>
      </div>
    </div>
  {/if}
{/await}
