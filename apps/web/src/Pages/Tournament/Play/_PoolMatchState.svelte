<script lang="ts">
  import type { TTSet, TTSetRules } from "@nttb/tt-match-ranking";
  import type { MatchSet } from "../../../data/match-set";

  import FaTrophy from "svelte-icons/fa/FaTrophy.svelte";
  import FaCross from "svelte-icons/fa/FaTimes.svelte";
  import { createEventDispatcher } from "svelte";

  import { getSetWinner } from "@nttb/tt-match-ranking/dist/helpers";

  export let set: MatchSet;
  export let side: "home" | "away";
  export let setRules: TTSetRules;

  interface Events {
    win: void;
    giveUp: void;
  }

  const dispatcher = createEventDispatcher<Events>();

  function onWinClick() {
    dispatcher("win");
  }

  function onGiveUpClick() {
    dispatcher("giveUp");
  }
  let hasWon = false;
  let hasGivenUp = false;

  $: {
    const ttSet: TTSet = {
      walkover: set.walkover,
      games: set.games,
    };

    hasWon = getSetWinner(ttSet, setRules) === side || set.walkover === side;
    hasGivenUp = set.walkover && set.walkover !== side;
  }
</script>

<div class="container">
  <div
    class="button score-button"
    class:active={hasWon}
    on:click={onWinClick}
    role="button"
  >
    <FaTrophy />
  </div>
  <div
    class="button giveup-button"
    class:active={hasGivenUp}
    on:click={onGiveUpClick}
    role="button"
  >
    <FaCross />
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .button {
    min-width: 24px;
    min-height: 24px;
    width: 24px;
    height: 24px;
  }

  .giveup-button,
  .score-button {
    color: silver;
  }
  .button:hover {
    color: grey;
  }
  .score-button.active,
  .score-button.active:hover {
    color: var(--nttb-orange);
  }
  .giveup-button.active,
  .giveup-button.active:hover {
    color: red;
  }
</style>
