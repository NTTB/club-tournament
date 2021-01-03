<script lang="ts">
  import type { PoolPlayer } from "../../../data/pool-player";
  import type { MatchSet } from "../../../data/match-set";

  export let set: MatchSet;
  export let homePlayer: PoolPlayer;
  export let awayPlayer: PoolPlayer;
  export let matchIndex: number;

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
</script>

<style>
  .match {
    display: flex;
    grid-template-columns: 48px 1fr min-content 4ch;
    flex-wrap: wrap;
  }
  .match-index {
    display: grid;
    text-align: center;
    align-self: center;
  }

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

  .players,
  .sets {
    display: grid;
  }
  .games {
    display: flex;
    gap: 8px;
  }

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

  .sets {
    width: 3ch;
  }
  .set {
    text-align: center;
  }
</style>

<div class="match">
  <div class="match-index">{matchIndex}</div>
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
            on:focus={selfSelect} />
        </div>
        <div class="score score--away">
          <input
            required
            type="text"
            bind:value={game.awayScore}
            pattern="[0-9]*"
            maxlength="3"
            on:focus={selfSelect} />
        </div>
      </div>
    {/each}
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
