<script lang="ts">
  import PlayerSearchBar from "./PlayerSearchBar.svelte";
  import { writable, derived } from "svelte/store";
  import TournamentHeader from "../_Header.svelte";
  import PageToggle from "./_PageToggle.svelte";
  import Toaster from "../../../Shared/Toaster.svelte";
  import PlayerInfo from "../../../Common/PlayerInfo.svelte";
  import CustomPlayerForm from "../../../Player/CustomPlayerForm.svelte";

  import PoolPlayerCard from "../../../Common/PoolPlayerCard.svelte";
  import {
    getPlayersFromTournament,
    removePlayerFromTournament,
    addPlayerToTournament,
  } from "../../../data/tournament-player-functions";
  import { customPlayerService } from "../../../data/custom-player/custom-player.service";
  import { findTournamentById } from "../../../data/tournament";
  import type { TournamentPlayer } from "../../../data/tournament-player";
  import PlayerSearch from "./PlayerSearch.svelte";
  import type { CustomPlayer } from "../../../data/custom-player/custom-player";

  /**
   * Tournament Id
   */
  export let id: string;

  var tournamentPromise = findTournamentById(+id);
  var players$ = getPlayersFromTournament(+id);

  // Search
  let searchQuery = "";

  // Filtering
  let filterTerms$ = writable<string[]>([]);

  // Create
  let customPlayer: CustomPlayer;

  let toasterMode: "add" | "edit" | "show" = undefined;

  let visiblePlayers$ = derived(
    [players$, filterTerms$],
    ([players, filterTerms]) => {
      if (filterTerms.length === 0) return players;
      return filterPlayers(players, filterTerms);
    }
  );

  let playerSearchBar: PlayerSearchBar;

  players$.subscribe(() => {
    playerSearchBar?.clearFilter();
  });

  let selectedPlayer: TournamentPlayer = undefined;

  function filterPlayers(
    players: TournamentPlayer[],
    filterTerms: string[]
  ): TournamentPlayer[] {
    return players.filter((player) =>
      filterTerms.every((term) => {
        return playerHasTerm(player, term);
      })
    );
  }

  function playerHasTerm(player: TournamentPlayer, term: string): boolean {
    if (player.info.name.toLowerCase().includes(term)) return true;
    if (player.info.club.toLowerCase().includes(term)) return true;
    if (player.nttbId && player.nttbId.toString(10).includes(term)) return true;
    return false;
  }

  function onPlayerClick(player: TournamentPlayer) {
    selectedPlayer = player;
    toasterMode = "show";
  }

  function hideToaster() {
    console.log("hideToaster");
    toasterMode = undefined;
  }

  function removePlayer() {
    removePlayerFromTournament(+id, selectedPlayer);
    selectedPlayer = undefined;
    toasterMode = undefined;
  }

  interface PlayerSearchBarEvent {
    mode: "add" | "filter";
    query: string;
  }

  function onSearchBarUpdate(ev: PlayerSearchBarEvent) {
    if (ev.mode === "filter") {
      const searchTerms = Array.from(
        new Set(ev.query.split(/ /).map((x) => x.trim().toLowerCase()))
      ).filter((x) => x.length);
      filterTerms$.set(searchTerms);
    } else {
      filterTerms$.set([]);
    }

    if (ev.mode === "add") {
      searchQuery = ev.query;
    } else {
      searchQuery = "";
    }
  }

  function onAddCustomPlayer(player: CustomPlayer) {
    addPlayerToTournament(+id, player);
  }

  function onEditCustomPlayer(player: CustomPlayer) {
    // Show the card in create mode
    customPlayer = player;
    toasterMode = "edit";
    playerSearchBar.clearFilter();
  }

  function onCreateCustomPlayer() {
    // Show the card in create mode
    customPlayer = {
      type: "custom",
      id: undefined,
      img: undefined,
      name: playerSearchBar.getQueryText(),
      club: "",
      rating: undefined,
      class: "",
    };
    toasterMode = "add";
    playerSearchBar.clearFilter();
  }

  async function onSaveCreatePlayer(createdPlayer: CustomPlayer) {
    console.log("onSaveCreatePlayer");
    toasterMode = undefined;
    var createdPlayer = await customPlayerService.create(createdPlayer);
    addPlayerToTournament(+id, createdPlayer);
  }

  async function onUpdatePlayer(updatedPlayer: CustomPlayer) {
    console.log("onUpdatePlayer");
    toasterMode = undefined;
    customPlayerService.update(updatedPlayer);
  }
</script>

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
    <div class="header">
      <PlayerSearchBar
        on:update={(ev) => onSearchBarUpdate(ev.detail)}
        bind:this={playerSearchBar}
      />
    </div>

    <div class="player-list">
      <PlayerSearch
        {id}
        {searchQuery}
        on:addCustomPlayer={(ev) => onAddCustomPlayer(ev.detail)}
        on:editCustomPlayer={(ev) => onEditCustomPlayer(ev.detail)}
        on:createCustomPlayer={() => onCreateCustomPlayer()}
      />

      {#each $visiblePlayers$ as player}
        <PoolPlayerCard {player} on:click={() => onPlayerClick(player)} />
      {/each}
    </div>
  </div>
  {#if toasterMode === "show"}
    <Toaster on:backgroundClicked={hideToaster}>
      <h3 slot="title">{selectedPlayer.info.name}</h3>
      <h4>Speler informatie</h4>
      <PlayerInfo player={selectedPlayer} />
      <h4>Verwijder uit toernooi</h4>
      <button on:click={removePlayer}>Verwijder speler uit toernooi</button>
    </Toaster>
  {:else if toasterMode === "add"}
    <Toaster on:backgroundClicked={hideToaster}>
      <CustomPlayerForm
        on:save={(ev) => onSaveCreatePlayer(ev.detail)}
        player={customPlayer}
      />
    </Toaster>
  {:else if toasterMode === "edit"}
    <Toaster on:backgroundClicked={hideToaster}>
      <CustomPlayerForm
        on:save={(ev) => onUpdatePlayer(ev.detail)}
        player={customPlayer}
      />
    </Toaster>
  {/if}
{/await}

<style>
  .container {
    --pageHeaderHeight: 125px;
    display: grid;
    grid-template-rows: 50px 1fr;
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "player-list";
    height: calc(100vh - var(--pageHeaderHeight));
    max-height: calc(100vh - var(--pageHeaderHeight));
    width: 100%;
  }

  .header {
    display: grid;
    grid-template-columns: 1fr;
    grid-area: header;
    padding-left: 8px;
    padding-right: 8px;
    border-top: 1px solid var(--nttb-blue);
    border-bottom: 1px solid var(--nttb-orange);
    background-color: var(--nttb-orange);
    place-content: center;
  }

  .player-list {
    grid-area: player-list;
    overflow: auto;

    box-sizing: border-box;
  }

  h4 {
    border-bottom: 1px solid black;
    margin-bottom: 8px;
  }
</style>
