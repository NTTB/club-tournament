<script lang="ts">
  import type { TournamentPlayer } from "../data/tournament-player";
  import { tournamentPlayers } from "../data/tournament-player";
  import MdRemoveCircleOutline from "svelte-icons/md/MdRemoveCircleOutline.svelte";
  import MdMoreVert from "svelte-icons/md/MdMoreVert.svelte";
  import type { PlayerInfo } from "../data/player-info";
  export let player: PlayerInfo;
  export let playerTournamentId: number; // The id of the player in the tournament
  export let nttbId: number | undefined = undefined;

  function handleDragStart(e: DragEvent) {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("text", playerTournamentId.toString());
  }
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 48px 1fr 48px;
    grid-template-rows: 24px 24px;
    grid-template-areas:
      "pic row1 button"
      "pic row2 button";
    padding: 8px;
    border: 1px solid black;
    border-radius: 3px;
    margin-bottom: 6px;
  }

  .avatar {
    grid-area: pic;
    border-radius: 100%;
    height: 48px;
    width: 48px;
    box-shadow: black 0px 0px 3px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding-left: 4px;
    padding-right: 4px;
  }

  .row-1 {
    grid-area: row1;
  }

  .row-2 {
    grid-area: row2;
  }

  .player-name,
  .club-name {
    flex-shrink: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre;
    margin-right: 4px;
  }
  .class-rating,
  .bondsnumber {
    flex-shrink: 0;
  }

  .button {
    grid-area: button;
  }
</style>

<div class="card" on:dragstart={handleDragStart} draggable="true">
  <img class="avatar" src={player.img} alt="Wouter" />
  <div class="row row-1">
    <div class="player-name">{player.name}</div>
    <div class="class-rating">{player.class} - {player.rating}</div>
  </div>
  <div class="row row-2">
    <div class="club-name">{player.club}</div>
    {#if nttbId}
      <div class="bondsnumber">{nttbId}</div>
    {/if}
  </div>
  <div class="button">
    <MdMoreVert />
  </div>
</div>
