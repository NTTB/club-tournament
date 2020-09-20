<script lang="ts">
  import type { TournamentPlayer } from "../data/tournament-player";
  import type { TouchRepositionEvent } from "../TouchRepositionEvent";
  import { tournamentPlayers } from "../data/tournament-player";
  import MdRemoveCircleOutline from "svelte-icons/md/MdRemoveCircleOutline.svelte";
  import MdDragHandle from "svelte-icons/md/MdDragHandle.svelte";
  import { createEventDispatcher } from "svelte";
  import MdMoreVert from "svelte-icons/md/MdMoreVert.svelte";
  import type { PlayerInfo } from "../data/player-info";
  export let player: PlayerInfo;
  export let playerTournamentId: number; // The id of the player in the tournament
  export let nttbId: number | undefined = undefined;

  const fingerSize = 50;

  let card: HTMLDivElement;
  let container: HTMLDivElement;
  const onTouchReposition = createEventDispatcher();

  function handleDragStart(e: DragEvent) {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("text", playerTournamentId.toString());
  }

  function onTouchStart(e: TouchEvent) {
    container.style.height = container.clientHeight + "px";
    card.style.width = card.clientWidth - 16 + "px";
    card.style.left = "16px";
  }

  let yPos = 0;

  function onTouchMove(e: TouchEvent) {
    let touchLocation = e.targetTouches[0];
    card.style.position = "absolute";
    // card.style.left = Math.floor(touchLocation.pageX - fingerSize) + "px";
    yPos = Math.floor(touchLocation.pageY - fingerSize);
    card.style.top = yPos + "px";
  }

  function onTouchEnd(e: TouchEvent) {
    onTouchReposition("touchReposition", {
      tournamentPlayerId: playerTournamentId,
      y: yPos,
    });
    // Reset the position, we will later report the actual end point and then the move can occur.
    card.style.position = "";
    card.style.width = "";
    card.style.left = "";
    card.style.top = "";
    container.style.height = "";
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
    /* Background color is white due to drag-n-drop*/
    background-color: white;
  }

  .container {
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

<div class="container" bind:this={container}>
  <div
    class="card"
    bind:this={card}
    on:dragstart={handleDragStart}
    draggable="true">
    <img
      class="avatar"
      src={player.img}
      alt={player.name}
      on:touchstart={onTouchStart}
      on:touchmove={onTouchMove}
      on:touchend={onTouchEnd} />
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
    <div
      class="button"
      on:touchstart={onTouchStart}
      on:touchmove={onTouchMove}
      on:touchend={onTouchEnd}>
      <MdDragHandle />
    </div>
  </div>
</div>
