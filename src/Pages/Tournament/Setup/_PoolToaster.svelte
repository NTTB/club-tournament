<script lang="ts">
  import MatchRules from "./Rules/MatchRules.svelte";
  import SetRules from "./Rules/SetRules.svelte";
  import { createEventDispatcher } from "svelte";
  import type { Pool } from "../../../data/pool";
  import type { PoolSettings } from "../../../data/pool-settings";
  import type { Tournament } from "../../../data/tournament";

  interface Events {
    deletePool: void;
  }

  const dispatcher = createEventDispatcher<Events>();

  export let tournament: Tournament;
  export let selectedPool: Pool;

  function onDeleteClick() {
    dispatcher("deletePool");
  }

  function toggleCustomSettings() {
    if (selectedPool.settings) {
      selectedPool.settings = undefined;
    } else {
      selectedPool.settings = copyPoolSettings(tournament.defaultPoolSettings);
    }
  }

  function copyPoolSettings(src: PoolSettings): PoolSettings {
    return {
      matchRules: {
        defeatPoints: src.matchRules.defeatPoints,
        victoryPoints: src.matchRules.victoryPoints,
      },
      setRules: {
        bestOf: src.setRules.bestOf,
        gameRules: {
          scoreDistance: src.setRules.gameRules.scoreDistance,
          scoreMinimum: src.setRules.gameRules.scoreMinimum,
        },
      },
    };
  }
</script>

<h4>Poule instellingen</h4>
<div class="row">
  <label for="maxPlayerCount">Maximaal aantal spelers</label>
  <input id="maxPlayerCount" bind:value={selectedPool.maxPlayerCount} />
</div>
<div class="row">
  <label
    ><input
      type="checkbox"
      checked={!!selectedPool.settings}
      on:change={toggleCustomSettings}
    />
    Afwijkenede instellingen
  </label>
</div>
{#if selectedPool.settings}
  <MatchRules rules={selectedPool.settings.matchRules} />
  <SetRules rules={selectedPool.settings.setRules} />
{/if}
<h4>Poule acties</h4>
<button on:click={onDeleteClick}>Verwijder poule</button>
