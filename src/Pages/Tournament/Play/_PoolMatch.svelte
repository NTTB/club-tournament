<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import PoolMatchState from "./_PoolMatchState.svelte";
  import type { PoolPlayer } from "../../../data/pool-player";
  import type { MatchSet } from "../../../data/match-set";

  export let set: MatchSet;
  export let homePlayer: PoolPlayer;
  export let awayPlayer: PoolPlayer;
  export let matchIndex: number;

  interface Events {
    update: MatchSet;
  }

  const dispatcher = createEventDispatcher<Events>();

  function hasWon(a: number, b: number) {
    a = +a;
    b = +b;

    if (a < b) return false;
    if (a < 11) return false;
    if (a - b < 2) return false;

    return true;
  }

  function selfSelect(ev: FocusEvent) {
    (ev.target as HTMLInputElement).select();
  }

  function sendUpdate() {
    dispatcher("update", set);
  }

  function setSetState(side: "home" | "away", state: "win" | "giveup") {
    // Remove all win/lose events
    set.events = (set.events ?? []).filter(
      (x) => x.type != "match-set-complete"
    );

    if (state == "win") {
      set.events.push({
        reason: "won",
        side: side,
        type: "match-set-complete",
      });
    } else if (state === "giveup") {
      const setHasPoints = set.games.some(
        (x) => x.homeScore > 0 || x.awayScore > 0
      );
      const otherSide: "home" | "away" = side == "home" ? "away" : "home";

      set.events.push({
        reason: setHasPoints ? "resign-during-play" : "resign-before-play",
        side: side,
        type: "match-set-complete",
      });

      set.events.push({
        reason: "won",
        side: otherSide,
        type: "match-set-complete",
      });
    }

    set.events = [...set.events];

    sendUpdate();
  }

  function setHomeToWin() {
    setSetState("home", "win");
  }
  function setAwayToWin() {
    setSetState("away", "win");
  }
  function setHomeToGiveUp() {
    setSetState("home", "giveup");
  }
  function setAwayToGiveUp() {
    setSetState("away", "giveup");
  }
</script>

<div class="match">
  <div class="match-index">{set.orderId}</div>
  <div class="players">
    <div class="player">A: {homePlayer.info.name}</div>
    <div class="player">X: {awayPlayer.info.name}</div>
  </div>

  <div class="games">
    {#each set.games as game}
      <div class="game">
        <div class="score score--home">
          <input
            required
            type="text"
            bind:value={game.homeScore}
            pattern="[0-9]*"
            maxlength="3"
            on:focus={selfSelect}
            on:change={sendUpdate}
          />
        </div>
        <div class="score score--away">
          <input
            required
            type="text"
            bind:value={game.awayScore}
            pattern="[0-9]*"
            maxlength="3"
            on:focus={selfSelect}
            on:change={sendUpdate}
          />
        </div>
      </div>
    {/each}
  </div>
  <div class="set-states">
    <div class="set-state set-state--home">
      <PoolMatchState
        {set}
        side={"home"}
        on:win={setHomeToWin}
        on:giveUp={setHomeToGiveUp}
      />
    </div>
    <div class="set-state set-state--away">
      <PoolMatchState
        {set}
        side={"away"}
        on:win={setAwayToWin}
        on:giveUp={setAwayToGiveUp}
      />
    </div>
  </div>
  <div class="sets">
    <div class="set set--home">
      {set.games.filter((x) => hasWon(x.homeScore, x.awayScore)).length}
    </div>
    <div class="set set--away">
      {set.games.filter((x) => hasWon(x.awayScore, x.homeScore)).length}
    </div>
  </div>
</div>

<style>
  .match {
    display: flex;
    grid-template-columns: 48px 1fr min-content min-content 4ch;
    flex-wrap: wrap;
  }
  .match-index {
    display: grid;
    text-align: center;
    align-self: center;
  }

  .set-state,
  .player,
  .set {
    align-self: center;
  }

  .players {
    flex-grow: 1;
  }

  .match-index {
    width: 48px;
  }

  .set-states,
  .players,
  .sets {
    display: grid;
  }
  .games {
    display: flex;
    gap: 8px;
  }

  .set-state,
  .score,
  .set {
    margin-bottom: 8px;
  }

  .score input {
    width: 5ch;
    margin: 0;
    text-align: right;
    padding: 4px;
  }

  .set-states {
    margin-left: 8px;
  }

  .sets {
    width: 3ch;
  }

  .set-state,
  .set {
    text-align: center;
  }
</style>
