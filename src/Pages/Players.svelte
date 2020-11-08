<script lang="ts">
  import Header from "../Shared/Header.svelte";
  import ViewToggle from "../Shared/ViewToggle.svelte";
  import PlayerCard from "../Common/PlayerCard.svelte";
  import SearchCardPlayer from "../Common/SearchCardPlayer.svelte";
  import SearchCardClub from "../Common/SearchCardClub.svelte";
  import SearchCardCustomPlayer from "../Common/SearchCardCustomPlayer.svelte";
  import { PlayerData } from "../data-players";
  import { ClubData } from "../data-clubs";
  import { tournamentPlayers } from "../data/tournament-player";

  let searchQuery = "";
  let searchInput: HTMLInputElement;
  $: searchTerms = [
    ...new Set(searchQuery.split(/\W+/).map((x) => x.trim().toLowerCase())),
  ];
  $: playerResults = PlayerData.filter(
    // Don't include players, that are already on the list
    (x) => !$tournamentPlayers.find((y) => y.nttbId === x.id)
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

  tournamentPlayers.subscribe(() => {
    searchQuery = "";
    if (searchInput) searchInput.focus();
  });
</script>

<style>
  .container {
    --pageHeaderHeight: 125px;
    display: grid;
    grid-template-rows: min-content 1fr;
    height: calc(100vh - var(--pageHeaderHeight));
    max-height: calc(100vh - var(--pageHeaderHeight));
    padding-left: 16px;
    padding-right: 16px;
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
    margin-right: -8px;
    padding-right: 8px;
    overflow: auto;
  }
</style>

<Header />
<ViewToggle />

<div class="container">
  <div class="field">
    <input
      type="text"
      placeholder="zoek op club, spelernaam of bondsnummer"
      bind:value={searchQuery}
      bind:this={searchInput} />
    {#if showSearch}
      <div class="results">
        {#each clubResults as club}
          <SearchCardClub {club} />
        {/each}

        {#each playerResults as result}
          <SearchCardPlayer player={result} />
        {/each}
        {#if showCustom}
          <SearchCardCustomPlayer />
        {/if}
      </div>
    {/if}
  </div>

  <div class="player-list">
    {#each $tournamentPlayers as player}
      <PlayerCard {player} />
    {/each}
  </div>
</div>
