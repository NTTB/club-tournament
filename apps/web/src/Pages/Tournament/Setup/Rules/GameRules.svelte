<script lang="ts">
  import type { TTGameRules } from "@nttb/tt-match-ranking";

  export let rules: TTGameRules;
</script>

<div class="field">
  <label for="pointsPerMatch">Game variant</label>
  <select id="pointsPerMatch" bind:value={rules.scoreMinimum}>
    <option value={11}>Tot de 11</option>
    <option value={21}>Tot de 21</option>
  </select>
</div>

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
