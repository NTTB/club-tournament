<script lang="ts">
  import type { PoolPlayer } from "../../../data/pool-player";

  export let homePlayer: PoolPlayer;
  export let awayPlayer: PoolPlayer;
  export let matchIndex: number;
  export let bestOf = 5;

  class Game {
    homeScore = 0;
    awayScore = 0;

    get isHomeWinner() {
      return this.isWinningScore(this.homeScore, this.awayScore);
    }

    get isAwayWinner() {
      return this.isWinningScore(this.awayScore, this.homeScore);
    }

    private isWinningScore(ownScore: number, otherScore: number) {
      const hasReachedMinimalScore = ownScore >= 11;
      const hasMinimalDifferenceOf2 = ownScore - otherScore >= 2;
      return hasReachedMinimalScore && hasMinimalDifferenceOf2;
    }
  }

  class Match {
    games: Game[] = [];

    constructor(public readonly bestOf: number) {
      for (var i = 0; i < bestOf; ++i) {
        this.games.push(new Game());
      }
    }
  }

  var match = new Match(bestOf);

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
    {#each match.games as game}
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
      {match.games.filter((x) => x.isHomeWinner).length}
    </div>
    <div class="set set--away">
      {match.games.filter((x) => x.isAwayWinner).length}
    </div>
  </div>
</div>
