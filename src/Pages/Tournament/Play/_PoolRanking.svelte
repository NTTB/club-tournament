<script lang="ts">
  import Ratio from "./_PoolRankingRatio.svelte";
  import {
    TTMatch,
    generateMatchRank,
    TTPlayerRank,
  } from "@nttb/tt-match-ranking";
  import type { TTMatchSet } from "@nttb/tt-match-ranking";
  import {
    getGameWinner,
    getSetWinner,
  } from "@nttb/tt-match-ranking/dist/helpers";

  import type { Pool } from "../../../data/pool";
  import type { PoolPlayer } from "../../../data/pool-player";
  import type { Tournament } from "../../../data/tournament";
  export let pool: Pool;
  export let tournament: Tournament;

  var match = new TTMatch<PoolPlayer>();
  pool.players.forEach((player) => {
    match.addPlayer(player);
  });

  pool.sets.forEach((set) => {
    var home = match
      .getPlayers()
      .find((x) => x.player.playerTournamentId == set.homeTournamentId).id;
    var away = match
      .getPlayers()
      .find((x) => x.player.playerTournamentId == set.awayTournamentId).id;
    if (set.resignTournamentPlayerId) {
      if (!set.resignDuringPlay) {
        // Walkover
        if (set.winnerTournamentPlayerId === set.homeTournamentId) {
          match.addSet(home, away, { games: [], walkover: "home" });
        } else {
          match.addSet(home, away, { games: [], walkover: "away" });
        }
        return;
      }
    }

    match.addSet(home, away, { games: set.games });
  });

  const setRules = {
    bestOf:
      pool.settings?.setsPerMatch ||
      tournament.defaultPoolSettings.setsPerMatch,
    gameRules: {
      scoreMinimum:
        pool.settings?.pointsPerSet ||
        tournament.defaultPoolSettings.pointsPerSet,
      scoreDistance: 2,
    },
  };

  const victoryPoints =
    pool.settings?.scorePerWin || tournament.defaultPoolSettings.scorePerWin;

  var ranking = generateMatchRank(
    match,
    { victoryPoints: victoryPoints, defeatPoints: victoryPoints - 1 },
    setRules
  );

  var totals: {
    set: { won: number; lost: number };
    games: { won: number; lost: number };
    score: { won: number; lost: number };
  }[] = [];

  ranking.ranked.forEach((rank) => {
    const sets = ranking.rankedSets.filter(
      (x) => x.awayPlayerId == rank.id || x.homePlayerId == rank.id
    );
    totals[rank.id] = {
      set: getSetsWonLost(rank, sets),
      games: getGamesWonLost(rank, sets),
      score: getScoreWonLost(rank, sets),
    };
  });

  function getSetsWonLost(
    src: TTPlayerRank<PoolPlayer>,
    sets: TTMatchSet[]
  ): { won: number; lost: number } {
    var won = 0;
    var lost = 0;

    sets.forEach((set) => {
      if (set.set.walkover) return; // Skip walkovers
      switch (getSetWinner(set.set, setRules)) {
        case "home":
          {
            if (set.homePlayerId == src.id) won += 1;
            if (set.awayPlayerId == src.id) lost += 1;
          }
          break;
        case "away":
          {
            if (set.homePlayerId == src.id) lost += 1;
            if (set.awayPlayerId == src.id) won += 1;
          }
          break;
      }
    });

    return { won, lost };
  }

  function getGamesWonLost(
    src: TTPlayerRank<PoolPlayer>,
    sets: TTMatchSet[]
  ): { won: number; lost: number } {
    var won = 0;
    var lost = 0;

    sets.forEach((set) => {
      if (set.set.walkover) return; // Skip walkovers
      set.set.games.forEach((game) => {
        var winner = getGameWinner(game, setRules.gameRules);
        if (
          (winner == "home" && set.homePlayerId == src.id) ||
          (winner == "away" && set.awayPlayerId == src.id)
        ) {
          won += 1;
        }

        if (
          (winner == "home" && set.awayPlayerId == src.id) ||
          (winner == "away" && set.homePlayerId == src.id)
        ) {
          lost += 1;
        }
      });
    });

    return { won, lost };
  }

  function getScoreWonLost(
    src: TTPlayerRank<PoolPlayer>,
    sets: TTMatchSet[]
  ): { won: number; lost: number } {
    var won = 0;
    var lost = 0;

    sets.forEach((set) => {
      set.set.games.forEach((game) => {
        won += set.homePlayerId == src.id ? game.homeScore : game.awayScore;
        lost += set.awayPlayerId == src.id ? game.homeScore : game.awayScore;
      });
    });

    return { won, lost };
  }
</script>

<table>
  <thead>
    <tr>
      <th colspan="2" style="text-align: left">Speler</th>
      <th class="col-points">P</th>
      <th style="text-align: center">Sets</th>
      <th>Games</th>
      <th>Score</th>
    </tr>
  </thead>
  <tbody>
    {#each ranking.ranked as ranked, index}
      <tr>
        <td class="center">{index + 1}.</td>
        <td>{ranked.player.info.name}</td>
        <td class="right">{ranked.points}</td>
        <td
          ><Ratio
            win={totals[ranked.id].set.won}
            lose={totals[ranked.id].set.lost}
          /></td
        >
        <td
          ><Ratio
            win={totals[ranked.id].games.won}
            lose={totals[ranked.id].games.lost}
          /></td
        >
        <td
          ><Ratio
            win={totals[ranked.id].score.won}
            lose={totals[ranked.id].score.lost}
          /></td
        >
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
    width: 600px;
    max-width: 100%;
  }
  th,
  td {
    font-variant-numeric: tabular-nums;
    min-width: 20px;
    border-bottom: 1px solid #f5f5f5;
    padding: 4px;
  }
  th {
    text-align: center;
    color: #70757a;
    font-weight: normal;
    font-size: small;
  }

  .center {
    text-align: center;
  }
  .right {
    text-align: right;
  }
  .col-points {
    width: 20px;
  }
</style>
