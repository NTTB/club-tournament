<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { tournamentPlayers } from "../data/tournament-player";
  import { poules, createNewPoule, movePlayerToPoule } from "../data/poule";
  import type { TournamentPlayer } from "../data/tournament-player";
  import type { Poule } from "../data/poule";
  import PoulePlayerCard2 from "../Common/PoulePlayerCard2.svelte";
  import MdMoreVert from "svelte-icons/md/MdMoreVert.svelte";
  import Hint from "../Common/Hint.svelte";
  
  interface CardInfo {
    currentPoule: Poule | undefined;
  }

  let showCard = false;
  let selectedPoule: Poule = undefined;
  let selectedPlayer: TournamentPlayer = undefined;
  let playerHeaderTitle = "Reserve spelers";

  let currentPlayers: TournamentPlayer[] = [];
  let currentPoules: Poule[] = [];

  let cardState: {
    old: CardInfo;
    cur: CardInfo;
  };

  $: {
    currentPoules = $poules;
  }
  $: {
    showCard = !!selectedPlayer;
  }

  $: {
    if (selectedPoule === undefined) {
      playerHeaderTitle = "Reserve spelers";
      // Add players that are NOT in a poule (aka the reserves)

      let outsidePlayersIds = $poules
        .flatMap((x) => x.players)
        .map((x) => x.playerTournamentId);

      currentPlayers = $tournamentPlayers.filter(
        (x) => !outsidePlayersIds.includes(x.id)
      );
    } else {
      playerHeaderTitle = `Poule ${selectedPoule.name}`;

      // Add players that are in a poule
      let placedPlayersIds = selectedPoule.players.map(
        (player) => player.playerTournamentId
      );
      currentPlayers = $tournamentPlayers.filter((x) =>
        placedPlayersIds.includes(x.id)
      );
    }
  }

  function onPlayerClick(player) {
    cardState = {
      old: {
        currentPoule: selectedPoule,
      },
      cur: {
        currentPoule: selectedPoule,
      },
    };
    selectedPlayer = player;
  }

  function hidePlayerCard() {
    if (cardState.cur.currentPoule != cardState.old.currentPoule) {
      movePlayerToPoule(selectedPlayer, cardState.cur.currentPoule);
    }
    selectedPlayer = undefined;
    cardState = undefined;
  }

  function createPoule() {
    createNewPoule();
  }

  function selectPoule(poule: Poule) {
    selectedPoule = poule;
  }

  function selectReservePoule() {
    selectPoule(undefined);
  }

  function deletePoule() {}
  function moveToPoule(poule: Poule) {
    movePlayerToPoule(selectedPlayer, poule);
    selectedPlayer = undefined;
    cardState = undefined;
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
    font-weight: bold;
    height: 48px;
    width: 48px;
    line-height: 48px;
    text-align: center;
    /** Remove the button style */
    padding: 0;
    margin: 0;
    border: none;
    border-bottom: 1px solid var(--nttb-orange);
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
    gap: 8px;
  }
  .tournament-actions button {
    width: 50px;
    margin: 0;
  }

  .tournament-actions button.current {
    width: 50px;
    margin: 0;
  }
</style>

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
      <div class="header">{playerHeaderTitle} - MK4 - (T1,T2)</div>
      <button><MdMoreVert /></button>
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
      <div class="sub-header">Verplaats naar Poule</div>
      <div class="tournament-actions">
        {#each currentPoules as poule}
          <button
            on:click={() => moveToPoule(poule)}
            class:current={selectedPoule == poule}
            disabled={selectedPoule == poule}>
            {poule.name}:{poule.players.length}
          </button>
        {/each}
        {#if currentPoules.length == 0}
          <Hint>
            Er zijn geen poules beschikbaar waar je de speler heen kan
            verplaatsen
          </Hint>
        {:else}
          <button
            on:click={() => moveToPoule(undefined)}
            class:current={selectedPoule == undefined}
            disabled={selectedPoule == undefined}>RES</button>
        {/if}
      </div>
    </div>
  </div>
{/if}
