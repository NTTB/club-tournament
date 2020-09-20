<script lang="ts">
  import Hint from "../Common/Hint.svelte";
  import PoulePlayerCard from "../Common/PoulePlayerCard.svelte";
  import MdGroup from "svelte-icons/md/MdGroup.svelte";
  import PouleSection from "./PouleSection.svelte";

  import { tournamentPlayers } from "../data/tournament-player";
  import { poules, META } from "../data/poule";
  import type { TouchRepositionEvent } from "../TouchRepositionEvent";

  $: unassignedPlayers = $tournamentPlayers.filter(
    (tp) =>
      !$poules.some((poule) =>
        poule.players.some((p) => p.playerTournamentId === tp.id)
      )
  );

  function dragOverSection(e: DragEvent) {
    e.dataTransfer.effectAllowed = "move";
    e.preventDefault();
  }

  function handleOnReserveDrop(e: DragEvent) {
    e.preventDefault();
    poules.update((_poules) => {
      const playerId = parseInt(e.dataTransfer.getData("text"));

      // Remove the player from all poules
      _poules.forEach((p) => {
        p.players = p.players.filter(
          (pp) => pp.playerTournamentId !== playerId
        );
      });

      return _poules;
    });
  }

  function handleOnNewDrop(e: DragEvent) {
    // Create a poule
    poules.update((_poules) => {
      const pouleId = META.nextId++;
      const playerId = parseInt(e.dataTransfer.getData("text"));

      // Remove the player from all poules
      _poules.forEach((p) => {
        p.players = p.players.filter(
          (pp) => pp.playerTournamentId !== playerId
        );
      });

      _poules.push({
        index: pouleId,
        name: "Poule " + pouleId,
        players: [
          {
            playerTournamentId: playerId,
            info: $tournamentPlayers.find((x) => x.id === playerId).info,
          },
        ],
      });

      return _poules;
    });
    e.preventDefault();
  }

  function onTouchReposition(e: CustomEvent<TouchRepositionEvent>) {
    const ev = e.detail;
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

  .auto-fill-button {
    width: 100%;
    height: 48px;
    background-color: var(--nttb-orange);
    color: var(--text-white);
    border: none;
    text-transform: uppercase;
    border-radius: 5px;
  }
</style>

{#each $poules as poule}
  <PouleSection {poule} on:touchReposition={onTouchReposition} />
{/each}

<div class="section">
  <div class="section-header">
    <div class="icon">
      <MdGroup />
    </div>
    <div class="title">Nieuwe poule</div>
  </div>
  <div
    class="section-body"
    on:dragover={dragOverSection}
    on:drop={handleOnNewDrop}>
    <Hint>Sleep spelers hier naar toe om een nieuwe poule te maken.</Hint>
  </div>
</div>

<div class="section">
  <div class="section-header">
    <div class="icon">
      <MdGroup />
    </div>
    <div class="title">Niet ingedeeld ({unassignedPlayers.length})</div>
  </div>
  <div
    class="section-body"
    on:dragover={dragOverSection}
    on:drop={handleOnReserveDrop}>
    {#if unassignedPlayers.length === 0}
      <Hint>Sleep spelers hier naar toe om ze uit het toernooi te halen</Hint>
    {/if}
    {#each unassignedPlayers as player}
      <PoulePlayerCard
        player={player.info}
        playerTournamentId={player.id}
        on:touchReposition={onTouchReposition} />
    {/each}
  </div>
</div>

<div class="section">
  <div class="section-body">
    <button class="auto-fill-button">Automatisch indelen</button>
  </div>
</div>
