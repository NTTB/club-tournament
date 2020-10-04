<script lang="ts">
  import { get } from "svelte/store";
  import { fly, fade, blur, slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import {
    tournamentPlayers as tournamentPlayersStore,
    META,
  } from "../data/tournament-player";
  import type { TournamentPlayer } from "../data/tournament-player";
  import { poules as poulesStore } from "../data/poule";
  import type { Poule, PoulePlayer } from "../data/poule";
  import PlayerCard from "../Common/PlayerCard.svelte";
  export let visible: boolean = false;

  export let tournamentPlayerId: number;
  let tournamentPlayers = get(tournamentPlayersStore) as TournamentPlayer[];
  let poules = get(poulesStore) as Poule[];
  let currentPlayer = tournamentPlayers.find(
    (player) => player.id === tournamentPlayerId
  );
  let currentPoule = poules.find((poule) => {
    let pouleIndex = poule.players.findIndex(
      (poulePlayer) => poulePlayer.playerTournamentId == tournamentPlayerId
    );
    if (pouleIndex === -1) return false;
    return true;
  });

  let currentPouleIndex = 1;

  // console.log(currentPoule);

  interface Events {
    close: void;
  }

  let close = createEventDispatcher<Events>();

  function onBackgroundClick() {
    // console.log(currentPoule);
    close("close");
  }
  function onCloseClick() {
    close("close");
  }
</script>

<style>
  .background {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 40%);
  }
  .toast {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 80vh;
    max-height: 80vh;
    overflow-y: auto;
    background-color: white;
    z-index: 101;
    border-radius: 12px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding-top: 8px;
    /* box-shadow: -2px 0 2px 1px black, 2px 0 2px 1px black; */
    /* border: 1px solid black; */
  }
  .toast__header {
    padding-left: 8px;
    padding-right: 8px;
    font-weight: bold;
    font-size: large;
    display: grid;
    align-items: center;

    grid-template-columns: 1fr auto;
    border-bottom: 1px solid black;
  }

  .toast__body {
    padding-left: 8px;
    padding-right: 8px;
  }

  .player-table {
    display: grid;
    grid-template-columns: 80px 1fr;
  }

  .poule-mover {
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      "label value"
      "--- button";
  }

  .poule-mover__button {
    grid-area: button;
  }
</style>

{#if visible}
  <div
    class="background"
    on:click={onBackgroundClick}
    transition:fade={{ duration: 100 }} />
  <div class="toast" transition:slide={{ duration: 100 }}>
    <div class="toast__header">
      <div class="toast__header__title">{currentPlayer.info.name}</div>
      <div class="toast__header__buttons">
        <button on:click={onCloseClick}>X</button>
      </div>
    </div>
    <div class="toast__body">
      {#if currentPlayer}
        <div class="player-table">
          <div class="th">Naam</div>
          <div class="td">{currentPlayer.info.name}</div>
          <div class="th">Club</div>
          <div class="td">{currentPlayer.info.club}</div>
          <div class="th">Rating</div>
          <div class="td">{currentPlayer.info.rating}</div>
          <div class="th">Niveau</div>
          <div class="td">{currentPlayer.info.class}</div>
        </div>
      {/if}

      {#if currentPoule}
        <div class="poule-mover">
          <div class="poule-mover__label">Poule</div>
          <select class="poule-mover__select" bind:value={currentPouleIndex}>
            <option value="-1">* Nieuwe poule</option>
            <option value="-2">* Niet ingedeeld</option>
            {#each poules as poule}
              <option value={poule.index}>{poule.name}</option>
            {/each}
          </select>
          {#if currentPouleIndex == -1}
            <button class="poule-mover__button">Nieuwe poule</button>
          {/if}
          {#if currentPouleIndex == -2}
            <button class="poule-mover__button">Verplaats naar niet ingedeeld
            </button>
          {/if}
          {#if currentPouleIndex > 0}
            <button class="poule-mover__button">Verplaats</button>
          {/if}
        </div>
      {/if}
      <p>Dit is de body van een toast</p>
      <p>{tournamentPlayerId}</p>
      <pre>Huidige poule: {JSON.stringify(currentPoule, undefined, 2)}</pre>
    </div>
  </div>
{/if}
