<script lang="ts">
  import type { TournamentPlayer } from "../data/tournament-player";
  import FaUserCircle from "svelte-icons/fa/FaUserCircle.svelte";
  export let player: TournamentPlayer;
</script>

<div
  data-test="pool-player-card"
  data-player={player.info.name}
  class="player-card"
  on:click
>
  <div class="avatar"><FaUserCircle /></div>
  <div class="name">{player.info.name}</div>
  <div class="rating">
    <span class="symbol">r</span>{player.info.rating}
  </div>
  <div class="division-and-club">
    {player.info.club || "N/A"} - {player.info.class || "???"}
  </div>
</div>

<style>
  .player-card {
    padding: 6px;
    border-bottom: 1px solid var(--nttb-orange);

    display: grid;
    column-gap: 8px;
    grid-template-columns: 52px 1fr 60px;
    grid-template-areas:
      "img name rating"
      "img divisionandclub divisionandclub";
  }

  .player-card:hover {
    background-color: #f1f1f1;
  }

  .player-card .avatar {
    height: 48px;
    width: 48px;
    box-shadow: black 0px 0px 3px;

    align-self: center;
    grid-area: img;
    border-radius: 100%;
    box-sizing: border-box;
  }
  .player-card .name {
    grid-area: name;
    font-weight: bold;
  }
  .player-card .division-and-club {
    grid-area: divisionandclub;
    color: var(--text-dimmed-black);
    font-size: 90%;
  }
  .player-card .rating {
    grid-area: rating;
    color: var(--text-dimmed-black);
    font-variant-numeric: tabular-nums;
    font-size: 90%;
    text-align: right;
  }
  .player-card .rating .symbol {
    font-variant: small-caps;
    font-weight: bold;
  }
</style>
