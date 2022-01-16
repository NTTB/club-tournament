<script lang="ts">
  import type { TTMatchRules } from "@nttb/tt-match-ranking";

  export let rules: TTMatchRules;

  let points = rules.victoryPoints;

  function setVictoryPoints() {
    rules.victoryPoints = points;
    rules.defeatPoints = points - 1;
  }
</script>

<div class="field">
  <label for="matchPointMethod">Aantal punten per wedstrijd</label>
  <select
    id="matchPointMethod"
    bind:value={points}
    on:blur={() => setVictoryPoints()}
  >
    <option value={1}>1 punt bij winst, 0 bij verlies</option>
    <option value={2}>2 punten bij winst, 1 bij verlies</option>
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
