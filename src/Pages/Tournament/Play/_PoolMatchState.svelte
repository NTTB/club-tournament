<script lang="ts">
  import FaTrophy from "svelte-icons/fa/FaTrophy.svelte";
  import FaCross from "svelte-icons/fa/FaTimes.svelte";
  import { createEventDispatcher } from "svelte";

  import type { MatchSet } from "../../../data/match-set";
  import type { MatchSetCompleteEvent } from "../../../data/match-event";

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

  export let set: MatchSet;
  export let side: "home" | "away";

  let hasWon = false;
  let hasGivenUp = false;

  let setEvents = set?.events || [];
  let sideEvents = setEvents
    .filter((x) => x.type == "match-set-complete")
    .map((x) => x as MatchSetCompleteEvent)
    .filter((x) => x.side == side);

  hasWon = sideEvents.some((x) => x.reason == "won");
  let hasGivenUpBeforePlay = sideEvents.some(
    (x) => x.reason == "resign-before-play"
  );
  let hasGivenUpAfterPlay = sideEvents.some(
    (x) => x.reason == "resign-during-play"
  );

  hasGivenUp = hasGivenUpAfterPlay || hasGivenUpBeforePlay;
</script>

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
    color: yellow;
  }
  .giveup-button.active,
  .giveup-button.active:hover {
    color: red;
  }
</style>

<div class="container">
  <div
    class="button score-button"
    class:active={hasWon}
    on:click={onWinClick}
    role="button">
    <FaTrophy />
  </div>
  <div
    class="button giveup-button"
    class:active={hasGivenUp}
    on:click={onGiveUpClick}
    role="button">
    <FaCross />
  </div>
</div>
