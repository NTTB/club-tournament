<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import PoolMatchState from "./_PoolMatchState.svelte";
  import type { PoolPlayer } from "../../../data/pool-player";
  import type { MatchSet } from "../../../data/match-set";
  import type { Tournament } from "../../../data/tournament";
  import type { Pool } from "../../../data/pool";

  export let set: MatchSet;
  export let tournament: Tournament;
  export let pool: Pool;

  const settings = pool.settings || tournament.defaultPoolSettings;
  const setRules = settings.setRules;

  const homePlayer: PoolPlayer = pool.players.find(
    (x) => x.playerTournamentId === set.homeTournamentId
  );

  const awayPlayer: PoolPlayer = pool.players.find(
    (x) => x.playerTournamentId === set.awayTournamentId
  );

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

  function clearSetResult() {
    set.walkover = undefined;
  }

  function onScoreUpdate() {
    clearSetResult();
    dispatcher("update", set);
  }

  function isGameComplete() {
    const settings = pool.settings || tournament.defaultPoolSettings;
    const scoreMinimum = settings.setRules.gameRules.scoreMinimum;
    const scoreDistance = settings.setRules.gameRules.scoreDistance;
    const reqGames = Math.ceil(settings.setRules.bestOf / 2);

    const wonHome = set.games.filter(
      (x) =>
        x.homeScore - x.awayScore >= scoreDistance &&
        x.homeScore >= scoreMinimum
    );
    const wonAway = set.games.filter(
      (x) =>
        x.awayScore - x.homeScore >= scoreDistance &&
        x.awayScore >= scoreMinimum
    );

    if (wonHome.length >= reqGames) return true;
    if (wonAway.length >= reqGames) return true;
    return false;
  }

  function setResign(side: "home" | "away") {
    const other: "home" | "away" = side === "home" ? "away" : "home";
    if (isGameComplete()) {
      alert("Unable to resign");
      return;
    }

    // Score is known
    const totalPoints = set.games.reduce(
      (pv, cv) => pv + cv.homeScore + cv.awayScore,
      0
    );

    let gameWasStarted = totalPoints > 0;

    if (!gameWasStarted) {
      // Game might have started even though there was no score.
      gameWasStarted = !confirm(
        "Heeft de speler opgegeven voor dat de wedstrijd gestart is?"
      );
    }

    if (!gameWasStarted) {
      // Register the game as walkover, since the set was never played.
      set.walkover = other;
    } else {
      // Set is considered played, update the score so that the other player wins.
      forceWinner(side);
    }

    dispatcher("update", set);
  }

  function forceWinner(side: "home" | "away") {
    const settings = pool.settings || tournament.defaultPoolSettings;
    const scoreMinimum = settings.setRules.gameRules.scoreMinimum;
    const scoreDistance = settings.setRules.gameRules.scoreDistance;
    const reqGames = Math.ceil(settings.setRules.bestOf / 2);
    // Update so that have minimal amount of score so that resigned .
    set.games.forEach((game) => {
      const hasMinDiffInScore = Math.abs(game.awayScore - game.homeScore) >= 2;
      const mostPoints = Math.max(game.awayScore, game.homeScore);
      const hasMinScore = mostPoints >= scoreMinimum;

      if (hasMinScore && hasMinDiffInScore) return;

      if (side == "home") {
        const gamesWon = set.games.filter(
          (x) =>
            x.awayScore - x.homeScore >= scoreDistance &&
            x.awayScore >= scoreMinimum
        );
        if (gamesWon.length >= reqGames) return;

        game.awayScore = Math.max(game.homeScore + scoreDistance, scoreMinimum);
      } else {
        const gamesWon = set.games.filter(
          (x) =>
            x.homeScore - x.awayScore >= scoreDistance &&
            x.homeScore >= scoreMinimum
        );
        if (gamesWon.length >= reqGames) return;

        game.homeScore = Math.max(game.awayScore + scoreDistance, scoreMinimum);
      }
    });

    // Create a new array to trigger view updates
    set.games = [...set.games];
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
            type="number"
            bind:value={game.homeScore}
            pattern="[0-9]*"
            maxlength="3"
            on:focus={selfSelect}
            on:change={onScoreUpdate}
          />
        </div>
        <div class="score score--away">
          <input
            required
            type="number"
            bind:value={game.awayScore}
            pattern="[0-9]*"
            maxlength="3"
            on:focus={selfSelect}
            on:change={onScoreUpdate}
          />
        </div>
      </div>
    {/each}
  </div>
  <div class="set-states">
    <div class="set-state set-state--home">
      <PoolMatchState
        {set}
        {setRules}
        side={"home"}
        on:giveUp={() => setResign("home")}
      />
    </div>
    <div class="set-state set-state--away">
      <PoolMatchState
        {set}
        {setRules}
        side={"away"}
        on:giveUp={() => setResign("away")}
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

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield; /* Firefox */
  }
</style>
