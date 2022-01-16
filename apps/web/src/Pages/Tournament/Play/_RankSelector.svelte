<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { TTMatchRank, TTPlayerRank } from "@nttb/tt-match-ranking";
  import type { PoolPlayer } from "../../../data/pool-player";
  import FaAngleDown from "svelte-icons/fa/FaAngleDown.svelte";
  import FaAngleUp from "svelte-icons/fa/FaAngleUp.svelte";

  export var rank: TTPlayerRank<PoolPlayer>;
  export var ranking: TTMatchRank<PoolPlayer>;

  interface ChangeRankEvent {
    move: "up" | "down";
    rank: TTPlayerRank<PoolPlayer>;
  }

  interface Events {
    changeRank: ChangeRankEvent;
  }

  const dispatcher = createEventDispatcher<Events>();

  function onUpClick() {
    dispatcher("changeRank", {
      move: "up",
      rank,
    });
  }

  function onDownClick() {
    dispatcher("changeRank", {
      move: "down",
      rank,
    });
  }

  const sharedWith = rank.sharedWith || [];
  const showButtons = sharedWith.length != 0;
  const otherPlayers = ranking.ranked.filter((x) =>
    (x.sharedWith || []).includes(rank.id)
  );
  var allPlayers = [rank, ...otherPlayers].sort(
    (a, b) => a.player.sameRankOrder - b.player.sameRankOrder
  );
  var allowUp = allPlayers[0].id != rank.id;
  var allowDown = allPlayers[allPlayers.length - 1].id != rank.id;
</script>

<div class="container">
  {#if showButtons}
    <button data-test="increase-rank" disabled={!allowUp} on:click={onUpClick}
      ><FaAngleUp /></button
    >
    <button
      data-test="decrease-rank"
      disabled={!allowDown}
      on:click={onDownClick}><FaAngleDown /></button
    >
  {/if}
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(2, 28px);
    gap: 8px;
    min-height: 28px;
  }
  .container button {
    height: 28px;
    width: 28px;
    margin: 0;
  }
</style>
