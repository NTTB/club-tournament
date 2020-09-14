<script lang="ts">
  import PlayerCard from "../Common/PlayerCard.svelte";
</script>

<style>
  .container {
    margin: 16px;
  }
</style>

<div class="container">
  <div class="field">
    <input type="text" placeholder="zoek op club, spelernaam of bondsnummer" />
  </div>

  <div class="player-list">
    <PlayerCard />
  </div>
</div>
