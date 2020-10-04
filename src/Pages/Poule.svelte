<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { tournamentPlayers } from "../data/tournament-player";
  import { poules } from "../data/poule";
  import PoulePlayerCard2 from "../Common/PoulePlayerCard2.svelte";
  import MdMoreVert from "svelte-icons/md/MdMoreVert.svelte";
  import Hint from "../Common/Hint.svelte";

  let showCard = false;

  let currentPlayers = [];

  $: {
    let placedPlayersIds = $poules
      .flatMap((x) => x.players)
      .map((x) => x.playerTournamentId);
    currentPlayers = $tournamentPlayers.filter(
      (x) => !placedPlayersIds.includes(x.id)
    );
  }

  function onPlayerClick(x) {
    showPlayerCard();
  }

  function showPlayerCard() {
    showCard = true;
  }
  function hidePlayerCard() {
    showCard = false;
  }

  function onPouleChanged() {
    confirm("Do you want to move the player to another poule?");
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
    height: 50vh;
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
</style>

<div class="container">
  <div class="left">
    <div class="left__center" class:noscroll={showCard}>
      <div class="tab">A:5</div>
      <div class="tab">B</div>
      <div class="tab">C</div>
      <div class="tab">4</div>
      <div class="tab">5</div>
      <div class="tab">6</div>
      <div class="tab">7</div>
      <div class="tab">8</div>
      <div class="tab">9</div>
      <div class="tab">10</div>
      <div class="tab">11</div>
      <div class="tab">12</div>
      <div class="tab">13</div>
      <div class="tab">14</div>
      <div class="tab">ZZ:20</div>
    </div>
    <div class="left__bottom">
      <div class="tab new">+</div>
      <div class="tab active">R</div>
    </div>
  </div>
  <div class="right">
    <div class="right__header">
      <div class="header">Reserve spelers</div>
      <button><MdMoreVert /></button>
    </div>
    <div class="right__bottom" class:noscroll={showCard}>
      {#each currentPlayers as player}
        <PoulePlayerCard2 {player} on:click={() => onPlayerClick(player)} />
      {/each}
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
      <div class="title">Wouter Lindenhof</div>
    </div>
    <div class="card__content">
      <div class="sub-header">Speler informatie</div>
      <div class="player-info">
        <div class="label">Club</div>
        <div class="value">Tielse TC</div>
        <div class="label">Rating</div>
        <div class="value">1234</div>
        <div class="label">Niveau</div>
        <div class="value">6de klas</div>
      </div>
      <div class="sub-header">Toernooi</div>
      <div class="tournament-actions">
        <select class="poule-mover__select">
          <option value="-1">R: Reserve poule / Niet ingedeeld</option>
          <option>P1: Poule 1</option>
          <option>P2: Poule 2</option>
          <option>P3: Poule 3</option>
          <option>P4: Poule 4</option>
          <option>P5: Poule 5</option>
        </select>
      </div>
      <Hint>Hier kan je spelers verplaatsen</Hint>
    </div>
  </div>
{/if}
