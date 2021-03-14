<script lang="ts">
  import GameRules from "./GameRules.svelte";
  import type { TTSetRules } from "@nttb/tt-match-ranking";

  export let rules: TTSetRules;
</script>

<div class="field">
  <label for="gamesPerMatch">Aantal games per set</label>
  <select id="gamesPerMatch" bind:value={rules.bestOf}>
    <option value={3}>Best of 3</option>
    <option value={5}>Best of 5</option>
    <option value={7}>Best of 7</option>
  </select>
</div>

<GameRules rules={rules.gameRules} />

<style>
  .field {
    max-width: 600px;
  }
  label {
    font-size: 18px;
    margin-top: 8px;
    margin-bottom: 4px;
  }
  select {
    width: 100%;
  }
</style>
