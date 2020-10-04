<script lang="ts">
  import Hint from "../Common/Hint.svelte";
  import { createEventDispatcher } from "svelte";
  import PoulePlayerCard2 from "../Common/PoulePlayerCard2.svelte";
  import MdGroup from "svelte-icons/md/MdGroup.svelte";
  import type { Poule, PoulePlayer } from "../data/poule";

  export let poule: Poule;

  interface AllEvents{
    PoulePlayerSelected: PoulePlayer
  };

  const onPoulePlayerSelect = createEventDispatcher<AllEvents>();
  

  function onPlayerClick(player: PoulePlayer) {
    onPoulePlayerSelect("PoulePlayerSelected", player);
    console.log(arguments);
  }
</script>

<style>
  .section-header {
    display: grid;
    height: 52px;
    grid-template-columns: 48px 1fr 48px;
    background-color: var(--nttb-orange);
    color: var(--text-white);
    font-size: 20px;
    align-items: center;
    margin-bottom: 6px;
  }

  .section-header .title {
    text-transform: uppercase;
  }

  .icon {
    height: 32px;
    width: 32px;
    padding: 8px;
  }
</style>

<div class="section">
  <div class="section-header">
    <div class="icon">
      <MdGroup />
    </div>
    <div class="title">{poule.name}</div>
  </div>
  <div class="section-body">
    {#if poule.players.length === 0}
      <Hint>Deze poule is leeg</Hint>
    {:else}
      {#each poule.players as player}
        <PoulePlayerCard2
          player={player.info}
          on:click={() => onPlayerClick(player)} />
      {/each}
    {/if}
  </div>
</div>
