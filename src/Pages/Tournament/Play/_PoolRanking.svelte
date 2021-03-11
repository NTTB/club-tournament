<script lang="ts">
  import type { MatchSet } from "../../../data/match-set";
  import type { PlayerInfo } from "../../../data/player-info";
  import type { Pool } from "../../../data/pool";
  import type { Tournament } from "../../../data/tournament";
  export let pool: Pool;
  export let tournament: Tournament;

  interface PlayerRank {
    player: {
      playerTournamentId: number;
      playerInfo: PlayerInfo;
      giveUpCount: number;
      notPlayedCount: number;
      strikePlayer: boolean;
    };
    score: number;
    setsWon: number;
    setsLost: number;
    gamesWon: number;
    gamesLost: number;
    gamePointsWon: number;
    gamePointsLost: number;
  }

  const settings = pool.settings || tournament.defaultPoolSettings;

  // 1. Foreach player in the pool create a ranking
  // 2. Remove players that have given up before playing half the matches
  // 3. Foreach ranking calculate score
  var requiredCompleteCount = Math.ceil((pool.players.length - 1) / 2);
  var matches: MatchSet[] = pool.rounds.reduce(
    (pv, cv) => [...pv, ...cv.matches],
    []
  );

  const giveUpInfo = pool.players.map((x) => {
    const id = x.playerTournamentId;
    const givenUp = matches.filter((y) => y.resignTournamentPlayerId == id);
    const notPlayedCount = givenUp.filter((y) => y.resignDuringPlay == false);

    return {
      playerTournamentId: x.playerTournamentId,
      playerInfo: x.info,
      giveUpCount: givenUp.length,
      notPlayedCount: notPlayedCount.length,
      strikePlayer: notPlayedCount.length >= requiredCompleteCount,
    };
  });

  const excludePlayerIds = giveUpInfo
    .filter((x) => x.strikePlayer)
    .map((x) => x.playerTournamentId);

  const remainingSets = matches.filter((match) => {
    const ignoreHomeplayer = excludePlayerIds.some(
      (y) => y == match.homeTournamentId
    );
    const ignoreAwayPlayer = excludePlayerIds.some(
      (y) => y == match.awayTournamentId
    );

    const ignoreMatch = ignoreAwayPlayer || ignoreHomeplayer;

    return !ignoreMatch;
  });

  const remainingPlayers = giveUpInfo.filter((x) => !x.strikePlayer);

  const unsortedRanking = remainingPlayers.map((p) => {
    const playerId = p.playerTournamentId;
    const homeSets = remainingSets.filter(
      (x) => x.homeTournamentId == playerId
    );
    const awaySets = remainingSets.filter(
      (x) => x.awayTournamentId == playerId
    );
    const allSets = [...homeSets, ...awaySets];

    let gamePointsWon = 0;
    let gamePointsLost = 0;
    let gamesWon = 0;
    let gamesLost = 0;
    homeSets.forEach((set) => {
      set.games.forEach((game) => {
        gamePointsWon += game.homeScore;
        gamePointsLost += game.awayScore;
        if (game.homeScore > game.awayScore) {
          gamesWon++;
        } else {
          gamesLost++;
        }
      });
    });

    awaySets.forEach((set) => {
      set.games.forEach((game) => {
        gamePointsWon += game.awayScore;
        gamePointsLost += game.homeScore;
        if (game.awayScore > game.homeScore) {
          gamesWon++;
        } else {
          gamesLost++;
        }
      });
    });

    // [X] Win/Lost Sets
    const setsWon = allSets.filter(
      (x) => x.winnerTournamentPlayerId === playerId
    ).length;
    const setsLost = allSets.filter(
      (x) => x.winnerTournamentPlayerId !== playerId
    ).length;
    const setsLostWithoutGivingup = allSets.filter(
      (x) =>
        x.winnerTournamentPlayerId != playerId &&
        x.resignTournamentPlayerId != playerId
    ).length;

    // [ ] Win/Lose
    // Two modes:
    // 1. Winner gets 2 points, loser 1, forfit 0.
    // 2. Winner gets 1 point, loser 0

    let score = 0;
    if (settings.scorePerWin == 2) {
      // Won? Two points.
      // Lose? 1 points
      // Give up during/before match? 0 points
      score += setsWon * 2;
      score += setsLostWithoutGivingup * 1;
    } else if (settings.scorePerWin == 1) {
      // Won? 1 point
      // Lose/giveup? 0 point
      score += setsWon * 1;
    }

    return {
      player: p,
      score, //S
      setsWon, // SW
      setsLost, //SL
      gamesWon, //GW
      gamesLost, // GL
      gamePointsWon, // PW
      gamePointsLost, // PL
    };
  });

  const ranking: PlayerRank[][] = 

  // [X] 1. Group the ranking by score.
  unsortedRanking.sort((a, b) => a.score - b.score);
  // [ ] Stap 2: Door het aantal behaalde setpunten in de onderlinge wedstrijden van de gelijk geëindigde deelnemers;
  // [ ] Stap 3: Door het quotiënt van gewonnen en verloren games van de onderlinge wedstrijden van de gelijk geëindigde deelnemers;
  // [ ] Stap 4: Door het quotiënt van gewonnen en verloren punten van de onderlinge wedstrijden van de gelijk geëindigde deelnemers;
  // [ ] Stap 5: Door het quotiënt van gewonnen en verloren games van alle door de gelijk geëindigde deelnemers gespeelde wedstrijden van de meerkamp;
  // [ ] Stap 6: Door het quotiënt van gewonnen en verloren punten van alle door de gelijk geëindigde deelnemers gespeelde wedstrijden van de meerkamp;
  // [X] Stap 7: indien dan nog geen beslissing is verkregen, dan beslist het lot.
</script>

<table>
  <tr>
    <th colspan="2">Speler</th>
    <th>S</th>
    <th>SW</th>
    <th>SL</th>
    <th>GW</th>
    <th>GL</th>
    <th>PW</th>
    <th>PL</th>
  </tr>
  {#each unsortedRanking as rank, index}
    <tr>
      <td>{index + 1}</td>
      <td>{rank.player.playerInfo.name}</td>
      <td>{rank.score}</td>
      <td>{rank.setsWon}</td>
      <td>{rank.setsLost}</td>
      <td>{rank.gamesWon}</td>
      <td>{rank.gamesLost}</td>
      <td>{rank.gamePointsWon}</td>
      <td>{rank.gamePointsLost}</td>
    </tr>
  {/each}
</table>

<hr />

<div>Showing pool {pool.name} of Tournament {tournament.name}</div>
<p>Deze spelers (en hun wedstrijden) hebben geef effect op de ranglijst</p>
<ul>
  {#each giveUpInfo.filter((x) => x.strikePlayer) as giveUp}
    <li>
      {giveUp.playerInfo.name} heeft {giveUp.notPlayedCount} niet gespeeld van de
      minimaal {requiredCompleteCount}
    </li>
  {/each}
</ul>

<p>Deze spelers hebben effect op de ranglijst</p>
<ul>
  {#each giveUpInfo.filter((x) => !x.strikePlayer) as giveUp}
    <li>
      {giveUp.playerInfo.name} ({giveUp.giveUpCount} niet gespeeld waarvan {giveUp.notPlayedCount}
      opgegeven)
    </li>
  {/each}
</ul>
<!-- <pre>
{JSON.stringify(remainingSets, undefined, 2)}
</pre> -->
