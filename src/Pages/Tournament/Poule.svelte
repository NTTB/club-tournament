<script lang="ts">
  import PageToggle from "./_PageToggle.svelte";
  import Toaster from "../../Shared/Toaster.svelte";
  import PoulePlayerToasterBody from "./_PoulePlayerToaster.svelte";
  import TournamentHeader from "./_Header.svelte";
  import { getPlayersFromTournament } from "../../data/tournament-player";
  import {
    createNewPoule,
    movePlayerToPoule,
    deletePoule,
    getPoulesFromTournament,
    removePlayerFromTournamentPoule,
  } from "../../data/poule";
  import type { TournamentPlayer } from "../../data/tournament-player";
  import type { Poule } from "../../data/poule";
  import PoulePlayerCard2 from "../../Common/PoulePlayerCard2.svelte";
  import MdDelete from "svelte-icons/md/MdDelete.svelte";
  import Hint from "../../Common/Hint.svelte";
  import { findTournamentById } from "../../data/tournament";

  export let id: string;
  var tournamentPromise = findTournamentById(+id);
  var tournamentPlayerStore = getPlayersFromTournament(+id);
  var poulesStore = getPoulesFromTournament(+id);

  let showCard = false;
  let selectedPoule: Poule = undefined;
  let selectedPlayer: TournamentPlayer = undefined;
  let playerHeaderTitle = "Reserve spelers";

  let currentPlayers: TournamentPlayer[] = [];
  let currentPoules: Poule[] = [];

  $: canDeletePoule = selectedPoule !== undefined;

  $: {
    currentPoules = $poulesStore;
  }
  $: {
    showCard = !!selectedPlayer;
  }

  $: {
    if (selectedPoule === undefined) {
      playerHeaderTitle = "Reserve spelers";
      // Add players that are NOT in a poule (aka the reserves)

      let outsidePlayersIds = $poulesStore
        .reduce((pv, cv) => [...pv, ...cv.players], [])
        .map((x) => x.playerTournamentId);
      currentPlayers = $tournamentPlayerStore
        .sort((a, b) => b.info.rating - a.info.rating)
        .filter((x) => !outsidePlayersIds.includes(x.id));
    } else {
      playerHeaderTitle = `Poule ${selectedPoule.name}`;
      if (selectedPoule.maxPlayerCount !== undefined) {
        playerHeaderTitle += ` - MK${selectedPoule.maxPlayerCount}`;
      } else {
        playerHeaderTitle += ` - MK?`;
      }

      if (selectedPoule.tableIds !== undefined) {
        if (selectedPoule.tableIds.length !== 0) {
          playerHeaderTitle +=
            ` (` + selectedPoule.tableIds.map((x) => `T${x}`).join(",") + `)`;
        } else {
          playerHeaderTitle += ` (T??)`;
        }
      }

      // Add players that are in a poule
      let placedPlayersIds = selectedPoule.players.map(
        (player) => player.playerTournamentId
      );
      currentPlayers = $tournamentPlayerStore
        .sort((a, b) => b.info.rating - a.info.rating)
        .filter((x) => placedPlayersIds.includes(x.id));
    }
  }

  function onPlayerClick(player) {
    selectedPlayer = player;
  }

  function hidePlayerCard() {
    selectedPlayer = undefined;
  }

  function createPoule() {
    createNewPoule(+id);
  }

  function selectPoule(poule: Poule) {
    selectedPoule = poule;
  }

  function selectReservePoule() {
    selectPoule(undefined);
  }

  function onPouleDeleteClick() {
    var currentPoule = selectedPoule;
    selectReservePoule();
    deletePoule(currentPoule);
  }
  function moveToPoule(poule: Poule) {
    if (!poule) {
      removePlayerFromTournamentPoule(selectedPlayer, +id);
    } else {
      movePlayerToPoule(selectedPlayer, poule);
    }

    selectedPlayer = undefined;
  }
</script>

<style>
  .container {
    --pageHeaderHeight: 125px;
    display: grid;
    grid-template-columns: 48px 1fr;
    height: calc(100vh - var(--pageHeaderHeight));
  }

  .left {
    display: grid;
    grid-template-rows: 1fr min-content;
    border-right: 1px solid var(--nttb-blue);

    height: calc(100vh - var(--pageHeaderHeight));
  }

  .right {
    display: grid;
    grid-template-rows: min-content 1fr;

    height: calc(100vh - var(--pageHeaderHeight));
  }

  .left__center {
    border-top: 1px solid var(--nttb-blue);
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
  .left__center.noscroll {
    overflow: hidden;
  }
  .tab {
    flex-shrink: 0;
    font-weight: bold;
    height: 48px;
    width: 47px;
    min-height: 48px;
    line-height: 48px;
    text-align: center;
    /** Remove the button style */
    padding: 0;
    margin: 0;
    border: none;
    border-bottom: 1px solid var(--nttb-orange);
    border-radius: 0;
    box-sizing: content-box;
  }
  .tab.active {
    background-color: var(--nttb-blue);
    color: var(--text-white);
    border-color: var(--nttb-blue);
  }
  .tab.new {
    border-bottom-color: var(--nttb-orange);
    background-color: var(--nttb-orange);
    color: var(--text-white);
  }

  .right__header {
    display: grid;
    grid-template-columns: 1fr 48px;
    padding-left: 12px;
    font-size: larger;
    font-weight: bold;
    background-color: var(--nttb-orange);
    color: white;
    line-height: 48px;
    height: 48px;
    border: 1px solid var(--nttb-orange);
    border-top-color: var(--nttb-blue);
  }

  .right__header button {
    color: white;
    background: none;
    border: none;
    height: 48px;
  }

  .right__bottom {
    overflow: auto;
  }

  .right__bottom.noscroll {
    overflow: hidden;
  }
</style>

{#await tournamentPromise}
  <TournamentHeader />
  <PageToggle {id} mode="poule" />
  <div class="container">
    <p>Loading...</p>
  </div>
{:then tournament}
  <TournamentHeader title={tournament.name} />
  <PageToggle {id} mode="poule" />

  <div class="container">
    <div class="left">
      <div class="left__center" class:noscroll={showCard}>
        {#each currentPoules as poule}
          <button
            class="tab"
            on:click={() => selectPoule(poule)}>{`${poule.name}:${poule.players.length}`}</button>
        {/each}
      </div>
      <div class="left__bottom">
        <button class="tab new" on:click={createPoule}>+</button>
        <button class="tab active" on:click={selectReservePoule}>RES</button>
      </div>
    </div>
    <div class="right">
      <div class="right__header">
        <div class="header">{playerHeaderTitle}</div>
        {#if canDeletePoule}
          <button on:click={onPouleDeleteClick}><MdDelete /></button>
        {/if}
      </div>
      <div class="right__bottom" class:noscroll={showCard}>
        {#each currentPlayers as player}
          <PoulePlayerCard2 {player} on:click={() => onPlayerClick(player)} />
        {/each}

        {#if currentPlayers.length == 0}
          <Hint>
            {selectedPoule == undefined ? `Er zijn geen reserve spelers` : `Er zijn geen spelers in Poule ${selectedPoule.name}`}
          </Hint>
        {/if}
      </div>
    </div>
  </div>

  {#if showCard}
    <Toaster on:backgroundClicked={hidePlayerCard}>
      <h3 slot="title">{selectedPlayer.info.name}</h3>
      <PoulePlayerToasterBody
        player={selectedPlayer}
        poules={currentPoules}
        {selectedPoule}
        on:moveToPoule={(ev) => moveToPoule(ev.detail)} />
    </Toaster>
  {/if}
{/await}
