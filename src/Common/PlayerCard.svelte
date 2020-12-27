<script lang="ts">
  import type { TournamentPlayer } from "../data/tournament-player";
  import { removePlayerFromTournament } from "../data/tournament-player-functions";
  import MdRemove from "svelte-icons/md/MdRemove.svelte";

  export let player: TournamentPlayer;
  export let tournamentId: number;

  function onRemoveClick() {
    removePlayerFromTournament(+tournamentId, player);
  }
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 48px 48px 1fr;
    grid-template-areas: "button img info";
    column-gap: 8px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .avatar {
    grid-area: img;
    align-self: center;
    height: 52px;
    width: 52px;
    border: 3px solid var(--nttb-blue);
    border-radius: 100%;
    box-sizing: border-box;
  }

  .info {
    grid-area: info;
  }

  .info .name {
    font-weight: bold;
  }

  .overflow-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre;
  }

  .secondary {
    font-size: 14px;
    color: var(--text-dimmed-black);
  }

  .rating {
    float: right;
    color: var(--text-dimmed-black);
    font-variant-numeric: tabular-nums;
    font-size: 13px;
    text-align: right;
    padding-right: 8px;
  }

  .rating .symbol {
    font-variant: small-caps;
    font-weight: bold;
  }

  .button {
    grid-area: button;
  }
</style>

<div class="card">
  <img class="avatar" src={player.info.img} alt="" />
  <div class="info">
    <div class="rating"><span class="symbol">r</span>{player.info.rating}</div>
    <div class="name">{player.info.name}</div>
    <div class="secondary overflow-ellipsis ">
      {`${player.info.club} - ${player.info.class}`}
    </div>
    <div class="secondary">{player.nttbId}</div>
  </div>
  <div class="button" on:click={onRemoveClick}>
    <MdRemove />
  </div>
</div>
