<script lang="ts">
  import Hint from "../Common/Hint.svelte";
  import PoulePlayerCard from "../Common/PoulePlayerCard.svelte";
  import MdGroup from "svelte-icons/md/MdGroup.svelte";
  import type { Poule } from "../data/poule";
  import { poules } from "../data/poule";
  import { tournamentPlayers } from "../data/tournament-player";

  export let poule: Poule;
  function dragOverSection(e: DragEvent) {
    e.dataTransfer.effectAllowed = "move";
    e.preventDefault();
  }

  function dropOnExistingSection(e: DragEvent) {
    e.preventDefault();
    poules.update((_poules) => {
      const playerId = parseInt(e.dataTransfer.getData("text"));

      // Remove the player from all the poules
      _poules.forEach((p) => {
        p.players = p.players.filter(
          (pp) => pp.playerTournamentId !== playerId
        );
      });

      // Add the player to the found poule
      const foundPoule = _poules.find((p) => p.index === poule.index);
      foundPoule.players.push({
        playerTournamentId: playerId,
        info: $tournamentPlayers.find((x) => x.id === playerId).info,
      });

      return _poules;
    });
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

  .section-body {
    padding-left: 16px;
    padding-right: 16px;
  }
</style>

<div class="section">
  <div class="section-header">
    <div class="icon">
      <MdGroup />
    </div>
    <div class="title">{poule.name}</div>
  </div>
  <div
    class="section-body"
    on:dragover={dragOverSection}
    on:drop={dropOnExistingSection}>
    {#if poule.players.length === 0}
      <Hint>Deze poule is leeg</Hint>
    {:else}
      {#each poule.players as player}
        <PoulePlayerCard
          player={player.info}
          playerTournamentId={player.playerTournamentId} />
      {/each}
    {/if}
  </div>
</div>
