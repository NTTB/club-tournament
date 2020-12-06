<script lang="ts">
  import TournamentHeader from "./_Header.svelte";
  import PageToggle from "./_PageToggle.svelte";

  import PlayerCard from "../../Common/PlayerCard.svelte";
  import PoulePlayerCard2 from "../../Common/PoulePlayerCard2.svelte";
  import SearchCardPlayer from "../../Common/SearchCardPlayer.svelte";
  import SearchCardClub from "../../Common/SearchCardClub.svelte";
  import SearchCardCustomPlayer from "../../Common/SearchCardCustomPlayer.svelte";
  import { PlayerData } from "../../data-players";
  import { ClubData } from "../../data-clubs";
  import { getPlayersFromTournament } from "../../data/tournament-player";
  import { findTournamentById } from "../../data/tournament";
  import MdSearch from "svelte-icons/md/MdSearch.svelte";

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
  .bottom-left{
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
  .search-row input {
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
        <PoulePlayerCard2 {player} />
        <!-- <PlayerCard {player} tournamentId={+id} /> -->
      {/each}
    </div>
  </div>
{/await}
