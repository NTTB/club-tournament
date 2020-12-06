<script lang="ts">
  import type { TournamentPlayer } from "../data/tournament-player";

  export let player: TournamentPlayer;
</script>

<style>
  .player-info {
    display: grid;
    grid-template-columns: 80px 1fr;
  }
</style>

<div class="player-info">
  <div class="label">Club</div>
  <div class="value">{player.info.club}</div>
  <div class="label">Rating</div>
  <div class="value">{player.info.rating}</div>
  <div class="label">Niveau</div>
  <div class="value">{player.info.class}</div>
</div>
