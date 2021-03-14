import { writable, derived, Readable } from "svelte/store";
import type { MatchSet } from "./match-set";
import type { Pool, PoolRound } from "./pool";
import type { TournamentPlayer } from "./tournament-player";

import {
  RoundRobinPool_3_Players,
  RoundRobinPool_4_Players,
  RoundRobinPool_5_Players,
  RoundRobinPool_6_Players,
  RoundRobinPool_7_Players,
  RoundRobinPool_8_Players,
  RoundRobinPool_9_Players,
  RoundRobinPool_10_Players,
  RoundRobinPool_11_Players,
  RoundRobinPool_12_Players,
} from "nttb-support";
import type { PoolSettings } from "./pool-settings";
import type { PoolPlayer } from "./pool-player";

function getPoolConfig(playerCount: number) {
  switch (playerCount) {
    case 3:
      return RoundRobinPool_3_Players;
    case 4:
      return RoundRobinPool_4_Players;
    case 5:
      return RoundRobinPool_5_Players;
    case 6:
      return RoundRobinPool_6_Players;
    case 7:
      return RoundRobinPool_7_Players;
    case 8:
      return RoundRobinPool_8_Players;
    case 9:
      return RoundRobinPool_9_Players;
    case 10:
      return RoundRobinPool_10_Players;
    case 11:
      return RoundRobinPool_11_Players;
    case 12:
      return RoundRobinPool_12_Players;
    default:
      throw new Error(`No known RoundRobinPool for ${playerCount} players`);
  }
}

interface PoolStorageTable {
  nextId: number;
  items: Pool[];
}

const pools = writable<PoolStorageTable>({ nextId: 1, items: [] });

try {
  const data = (JSON.parse(localStorage.getItem("data.poules")));
  if (!Array.isArray(data)) {
    pools.set(data as PoolStorageTable || { nextId: 1, items: [] });
  } else {
    console.warn("Old array style data")
  }
} catch {
  console.info("No previous data");
}

pools.subscribe(values => {
  localStorage.setItem("data.poules", JSON.stringify(values, undefined, 2));
});

function generatePoolName(n: number) {
  var numbers = [];
  do {
    n -= 1; // Start at 1
    var remainder = n % 26;
    numbers.unshift(remainder);
    n -= remainder;
    n /= 26;
  } while (n != 0);

  var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var letters = [];
  numbers.forEach((element) => {
    letters.push(alpha.charAt(element));
  });
  return letters.join("");
}

export function updatePool(pool: Pool) {
  pools.update(src => {
    const index = src.items.findIndex(x => x.id === pool.id);
    if (index == -1) return src;
    src.items.splice(index, 1, pool);
    return src;
  });
}

export function removePlayerFromTournamentPool(player: TournamentPlayer, tournamentId: number) {
  MustBeNumber(tournamentId);
  if (player.tournamentId != tournamentId) {
    throw new Error("tournamentPlayer is not related to this tournament");
  }

  pools.update(src => {
    src.items
      .filter(x => x.tournamentId === tournamentId)
      .forEach(p => p.players = p.players.filter(x => x.playerTournamentId != player.id));

    return src;
  });
}

export function movePlayerToPool(player: TournamentPlayer, pool: Pool) {
  if (player.tournamentId != pool.tournamentId) {
    throw new Error("tournamentPlayer can not be moved to a pool from another tournament");
  }
  pools.update(src => {
    // Remove the player from all other pools of that tournament
    src.items
      .filter(x => x.tournamentId === pool.tournamentId)
      .forEach(p => p.players = p.players.filter(x => x.playerTournamentId != player.id));

    if (pool) {
      pool.players.push({ playerTournamentId: player.id, info: player.info });
    }

    return src;
  });
}

export function getPoolsFromTournament(tournamentId: number) {
  MustBeNumber(tournamentId);

  return derived(pools, x => x.items.filter(y => y.tournamentId == tournamentId));
}


export function deletePool(pool: Pool) {
  if (!pool) return;
  pools.update(collection => {
    collection.items = collection.items.filter(x => x.id != pool.id);
    return collection;
  });
}

export function createNewPool(tournamentId: number) {
  MustBeNumber(tournamentId);

  pools.update(src => {
    // Find new key for pool
    var existingPools = src.items.filter(x => x.tournamentId === tournamentId);
    var nextIndex = existingPools.map(x => x.index).reduce((pv, cv) => cv > pv ? cv : pv, 0) + 1;

    var pool: Pool = {
      id: src.nextId++,
      tournamentId: tournamentId,
      index: nextIndex,
      name: generatePoolName(nextIndex),
      players: [],
      sets: undefined
    };
    src.items.push(pool);
    return src;
  });
}

export function getPoolById(poolId): Readable<Pool> {
  return derived(pools, storage => storage.items.find(x => x.id == poolId));
}

function generateSets(players: PoolPlayer[], setPerMatch: number): MatchSet[] {
  const slotSize = players.length;
  const poolConfig = getPoolConfig(slotSize);
  var matchId = 0;
  var result = [];
  poolConfig.matches.forEach((roundSrc, roundIndex) => {
    roundSrc.forEach((setSrc) => {
      const set: MatchSet = {
        homeTournamentId: players[setSrc.home - 1].playerTournamentId,
        awayTournamentId: players[setSrc.away - 1].playerTournamentId,
        roundId: roundIndex,
        games: [],
        orderId: 0,
      };

      for (var i = 0; i < setPerMatch; ++i) {
        set.games.push({
          homeScore: 0,
          awayScore: 0,
        });
      }
      set.orderId = ++matchId;

      result.push(set);

    });
  });

  return result;
}

export function startPoolById(poolId: number, defaultPoolSettings: PoolSettings) {
  pools.update(poolTable => {
    var pool = poolTable.items.find(x => x.id === poolId);
    if (!pool) return poolTable;

    if (pool.sets) throw new Error("The pool already has sets and can not be started");

    pool.sets = generateSets(pool.players, (pool.settings ?? defaultPoolSettings).setsPerMatch);
    return poolTable;
  });
}

function MustBeNumber(tournamentId: number) {
  if (typeof tournamentId !== "number") {
    throw new Error("tournamentId must be a number");
  }
}
