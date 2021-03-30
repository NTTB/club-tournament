<script lang="ts">
  import Ratio from "./_PoolRankingRatio.svelte";
  import RankSelector from "./_RankSelector.svelte";

  import type { TTMatchSet } from "@nttb/tt-match-ranking";
  import type { Pool } from "../../../data/pool";
  import type { PoolPlayer } from "../../../data/pool-player";
  import type { Tournament } from "../../../data/tournament";

  import {
    TTMatch,
    generateMatchRank,
    TTPlayerRank,
  } from "@nttb/tt-match-ranking";
  import {
    getGameWinner,
    getSetWinner,
  } from "@nttb/tt-match-ranking/dist/helpers";

  import { updatePool } from "../../../data/pool-functions";

  export let pool: Pool;
  export let tournament: Tournament;

  var match = new TTMatch<PoolPlayer>();
  const poolPlayerSorted = [...pool.players].sort(
    (a, b) => a.sameRankOrder - b.sameRankOrder
  );
  poolPlayerSorted.forEach((player) => {
    match.addPlayer(player);
  });

  pool.sets.forEach((set) => {
    var home = match
      .getPlayers()
      .find((x) => x.player.playerTournamentId == set.homeTournamentId).id;
    var away = match
      .getPlayers()
      .find((x) => x.player.playerTournamentId == set.awayTournamentId).id;

    if (set.walkover) {
      match.addSet(home, away, { games: [], walkover: set.walkover });
      return;
    }

    match.addSet(home, away, { games: set.games });
  });

  const settings = pool.settings || tournament.defaultPoolSettings;
  const setRules = settings.setRules;
  const matchRules = settings.matchRules;

  var ranking = generateMatchRank(match, matchRules, setRules);
  var skipList: number[] = [];
  var dirtySameRank = false;
  for (var i = 0; i < ranking.ranked.length; ++i) {
    var rank = ranking.ranked[i];
    if (skipList.includes(rank.id)) continue;
    const others = rank.sharedWith || [];
    var sameBatch = [rank.id, ...others];
    skipList.push(...sameBatch);
    if (others.length) {
      // If any of the sameBatch has a sameRank of 0 (which is no equal rank).
      // Then we will update the pool
      var samePlayerBatch = ranking.ranked.filter((x) =>
        sameBatch.includes(x.id)
      );
      var generateSameRankOrder = samePlayerBatch.some(
        (x) => x.player.sameRankOrder == 0
      );
      if (generateSameRankOrder) {
        samePlayerBatch.forEach((r, i) => {
          r.player.sameRankOrder = i + 1;
        });
        dirtySameRank = true;
      }
    } else {
      // Expect same rank to be zero
      if (rank.player.sameRankOrder == 0) continue;
      rank.player.sameRankOrder = 0;
      dirtySameRank = true;
    }
  }

  if (dirtySameRank) {
    updatePool(pool);
  }

  var totals: {
    set: { won: number; lost: number };
    games: { won: number; lost: number };
    score: { won: number; lost: number };
    walkovers: number;
    walkaways: number;
  }[] = [];

  var sharing: { others: string[] }[] = [];
  ranking.ranked.forEach((rank) => {
    sharing[rank.id] = {
      others: rank.sharedWith.map((y) => match.getPlayerById(y).info.name),
    };
  });

  ranking.ranked.forEach((rank) => {
    const sets = ranking.rankedSets.filter(
      (x) => x.awayPlayerId == rank.id || x.homePlayerId == rank.id
    );
    totals[rank.id] = {
      set: getSetsWonLost(rank, sets),
      games: getGamesWonLost(rank, sets),
      score: getScoreWonLost(rank, sets),
      walkovers: getWalkovers(rank, sets),
      walkaways: getWalkaways(rank, sets),
    };
  });

  function getWalkovers(
    src: TTPlayerRank<PoolPlayer>,
    sets: TTMatchSet[]
  ): number {
    let result = 0;

    result += sets.filter(
      (x) => x.homePlayerId === src.id && x.set.walkover === "home"
    ).length;
    result += sets.filter(
      (x) => x.awayPlayerId === src.id && x.set.walkover === "away"
    ).length;

    return result;
  }

  function getWalkaways(
    src: TTPlayerRank<PoolPlayer>,
    sets: TTMatchSet[]
  ): number {
    let result = 0;

    result += sets.filter(
      (x) => x.awayPlayerId === src.id && x.set.walkover === "home"
    ).length;
    result += sets.filter(
      (x) => x.homePlayerId === src.id && x.set.walkover === "away"
    ).length;
    return result;
  }

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

  function changeRank({
    move,
    rank,
  }: {
    move: "up" | "down";
    rank: TTPlayerRank<PoolPlayer>;
  }) {
    var index = ranking.ranked.indexOf(rank);
    const leftPlayer = rank;
    var rightPlayer: TTPlayerRank<PoolPlayer> = undefined;
    if (move == "down" && index < ranking.ranked.length) {
      // Find player below
      rightPlayer = ranking.ranked[index + 1];
    }
    if (move == "up" && index > 0) {
      // Find player above
      rightPlayer = ranking.ranked[index - 1];
    }

    if (!leftPlayer.sharedWith.includes(rightPlayer.id)) {
      throw new Error("Players that are not sharing rank can not be swapped");
    }

    // Swap the numbers
    const c = leftPlayer.player.sameRankOrder;
    leftPlayer.player.sameRankOrder = rightPlayer.player.sameRankOrder;
    rightPlayer.player.sameRankOrder = c;

    updatePool(pool);
  }
</script>

<table>
  <thead>
    <tr>
      <th colspan="2" style="text-align: left">Speler</th>
      <th class="col-points">P</th>
      <th style="text-align: center">Sets</th>
      <th style="text-align: center">WO/WA</th>
      <th>Games</th>
      <th>Score</th>
      <th />
      <th />
    </tr>
  </thead>
  <tbody>
    {#each ranking.ranked as ranked, index}
      <tr
        data-test={"place-" + (index + 1)}
        data-test-player={ranked.player.info.name}
      >
        <td class="center">{index + 1}.</td>
        <td data-test={"place-" + (index + 1) + "-name"}
          >{ranked.player.info.name}</td
        >
        <td class="right">{ranked.points}</td>
        <td
          ><Ratio
            win={totals[ranked.id].set.won}
            lose={totals[ranked.id].set.lost}
          /></td
        >
        <td
          ><Ratio
            win={totals[ranked.id].walkovers}
            lose={totals[ranked.id].walkaways}
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
        <td data-test="shares-rank">{sharing[ranked.id].others.join(",")}</td>
        <td
          ><RankSelector
            rank={ranked}
            {ranking}
            on:changeRank={(ev) => changeRank(ev.detail)}
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
