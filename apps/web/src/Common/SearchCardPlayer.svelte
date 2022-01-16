<script lang="ts">
  import MdAddCircleOutline from "svelte-icons/md/MdAddCircleOutline.svelte";
  import FaUserCircle from "svelte-icons/fa/FaUserCircle.svelte";
  import type { CustomPlayer } from "../data/custom-player/custom-player";
  import { createEventDispatcher } from "svelte";

  export let player: CustomPlayer;

  interface Events {
    add: CustomPlayer;
    edit: CustomPlayer;
  }

  const dispatcher = createEventDispatcher<Events>();
</script>

<div class="card" data-test="search-card-player" data-player={player.name}>
  <div class="avatar"><FaUserCircle /></div>
  <div class="row row-1">
    <div class="player-name">{player.name}</div>
    <div class="class-rating">{player.class} - {player.rating}</div>
  </div>
  <div class="row row-2">
    <div class="club-name">{player.club}</div>
    <div class="bondsnumber">
      <button on:click={() => dispatcher("edit", player)}>Edit</button>
    </div>
  </div>
  <div
    data-test="add-button"
    class="button"
    on:click={() => dispatcher("add", player)}
  >
    <MdAddCircleOutline />
  </div>
</div>

<style>
  .card {
    display: grid;
    grid-template-columns: 48px 1fr 48px;
    grid-template-rows: 24px 24px;
    grid-template-areas:
      "pic row1 button"
      "pic row2 button";
    padding: 8px;
    border-top: 1px solid black;
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
