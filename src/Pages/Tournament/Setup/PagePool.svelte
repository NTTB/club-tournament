<script lang="ts">
  import MdSettings from "svelte-icons/md/MdSettings.svelte";
  import PageToggle from "./_PageToggle.svelte";
  import TournamentHeader from "../_Header.svelte";
  import Toaster from "../../../Shared/Toaster.svelte";
  import PoolPlayerToasterBody from "./_PoolPlayerToaster.svelte";
  import PoolToaster from "./_PoolToaster.svelte";
  import { getPlayersFromTournament } from "../../../data/tournament-player-functions";
  import {
    createNewPool,
    movePlayerToPool,
    deletePool,
    getPoolsFromTournament,
    removePlayerFromTournamentPool,
    updatePool,
  } from "../../../data/pool-functions";
  import type { TournamentPlayer } from "../../../data/tournament-player";
  import type { Pool } from "../../../data/pool";
  import PoolPlayerCard from "../../../Common/PoolPlayerCard.svelte";
  import Hint from "../../../Common/Hint.svelte";
  import { findTournamentById } from "../../../data/tournament";

  export let id: string;
  var tournamentPromise = findTournamentById(+id);
  var tournamentPlayerStore = getPlayersFromTournament(+id);
  var poolsStore = getPoolsFromTournament(+id);

  let showPlayerCard = false;
  let showPoolCard = false;
  let selectedPool: Pool = undefined;
  let selectedPlayer: TournamentPlayer = undefined;
  let playerHeaderTitle = "Reserve spelers";

  let currentPlayers: TournamentPlayer[] = [];
  let currentPools: Pool[] = [];

  $: canDeletePool = selectedPool !== undefined;
  $: canAutoDraft = selectedPool === undefined;

  $: {
    currentPools = $poolsStore;
  }
  $: {
    showPlayerCard = !!selectedPlayer;
  }

  $: {
    if (selectedPool === undefined) {
      showPoolCard = false;
      playerHeaderTitle = "Reserve spelers";
      // Add players that are NOT in a poule (aka the reserves)

      let outsidePlayersIds = $poolsStore
        .reduce((pv, cv) => [...pv, ...cv.players], [])
        .map((x) => x.playerTournamentId);
      currentPlayers = $tournamentPlayerStore
        .sort((a, b) => b.info.rating - a.info.rating)
        .filter((x) => !outsidePlayersIds.includes(x.id));
    } else {
      showPoolCard = false;
      playerHeaderTitle = `Poule ${selectedPool.name}`;
      if (selectedPool.maxPlayerCount !== undefined) {
        playerHeaderTitle += ` - MK${selectedPool.maxPlayerCount}`;
      } else {
        playerHeaderTitle += ` - MK?`;
      }

      if (selectedPool.tableIds !== undefined) {
        if (selectedPool.tableIds.length !== 0) {
          playerHeaderTitle +=
            ` (` + selectedPool.tableIds.map((x) => `T${x}`).join(",") + `)`;
        } else {
          playerHeaderTitle += ` (T??)`;
        }
      }

      // Add players that are in a poule
      let placedPlayersIds = selectedPool.players.map(
        (player) => player.playerTournamentId
      );
      currentPlayers = $tournamentPlayerStore
        .sort((a, b) => b.info.rating - a.info.rating)
        .filter((x) => placedPlayersIds.includes(x.id));
    }
  }

  function onPlayerClick(player: TournamentPlayer) {
    selectedPlayer = player;
  }

  function hidePlayerCard() {
    selectedPlayer = undefined;
  }

  function hidePoolCard() {
    if (selectedPool) {
      updatePool(selectedPool);
    }
    showPoolCard = false;
  }

  function onPoolSettingsClick() {
    showPoolCard = true;
  }

  function createPool() {
    createNewPool(+id);
  }

  function selectPool(pool: Pool) {
    selectedPool = pool;
  }

  function selectReservePool() {
    selectPool(undefined);
  }

  function onPoolDeleteClick() {
    var currentPool = selectedPool;
    selectReservePool();
    deletePool(currentPool);
  }

  function moveToPool(pool: Pool) {
    console.log(pool);
    if (!pool) {
      removePlayerFromTournamentPool(selectedPlayer, +id);
    } else {
      movePlayerToPool(selectedPlayer, pool);
    }

    selectedPlayer = undefined;
  }
</script>

{#await tournamentPromise}
  <TournamentHeader />
  <PageToggle {id} mode="pool" />
  <div class="container">
    <p>Loading...</p>
  </div>
{:then tournament}
  <TournamentHeader title={tournament.name} />
  <PageToggle {id} mode="pool" />

  <div class="container">
    <div class="left">
      <div class="left__center" class:noscroll={showPlayerCard}>
        {#each currentPools as pool}
          <button class="tab" on:click={() => selectPool(pool)}
            >{`${pool.name}:${pool.players.length}`}</button
          >
        {/each}
      </div>
      <div class="left__bottom">
        <button class="tab new" on:click={createPool}>+</button>
        <button class="tab active" on:click={selectReservePool}>RES</button>
      </div>
    </div>
    <div class="right">
      <div class="right__header" class:right__header--reserve={canAutoDraft}>
        <div class="header">{playerHeaderTitle}</div>
        {#if canDeletePool}
          <button on:click={onPoolSettingsClick}><MdSettings /></button>
        {/if}
        {#if canAutoDraft}
          <div>
            <a class="secondary" href={`#/tournament/${id}/pool/auto-draft`}
              >Snel Indelen</a
            >
          </div>
        {/if}
      </div>
      <div class="right__bottom" class:noscroll={showPlayerCard}>
        {#each currentPlayers as player}
          <PoolPlayerCard {player} on:click={() => onPlayerClick(player)} />
        {/each}

        {#if currentPlayers.length == 0}
          <Hint>
            {selectedPool == undefined
              ? `Er zijn geen reserve spelers`
              : `Er zijn geen spelers in Poule ${selectedPool.name}`}
          </Hint>
        {/if}
      </div>
    </div>
  </div>

  {#if showPlayerCard}
    <Toaster on:backgroundClicked={hidePlayerCard}>
      <h3 slot="title">{selectedPlayer.info.name}</h3>
      <PoolPlayerToasterBody
        player={selectedPlayer}
        pools={currentPools}
        {selectedPool}
        on:moveToPool={(ev) => moveToPool(ev.detail)}
      />
    </Toaster>
  {/if}

  {#if showPoolCard}
    <Toaster on:backgroundClicked={hidePoolCard}>
      <h3>{selectedPool.name}</h3>
      <PoolToaster
        {tournament}
        {selectedPool}
        on:deletePool={onPoolDeleteClick}
      />
    </Toaster>
  {/if}
{/await}

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
    border-right: none;
    border-top-color: var(--nttb-blue);
  }

  .right__header.right__header--reserve {
    grid-template-columns: 1fr max-content;
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

  a.secondary {
    display: block;
    height: 48px;
    min-width: 48px;
    background-color: var(--nttb-blue);
    color: white;
    padding-left: 12px;
    padding-right: 8px;
    line-height: 48px;
    text-decoration: none;
  }
</style>
