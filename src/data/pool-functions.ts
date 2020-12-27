import { writable, derived, Readable } from "svelte/store";
import type { Pool } from "./pool";
import type { PoolStanding, PoolStandingItem } from "./pool-standing";
import type { TournamentPlayer } from "./tournament-player";

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
      players: []
    };
    src.items.push(pool);
    return src;
  });
}

export function getPoolById(poolId): Readable<Pool> {
  return derived(pools, storage => storage.items.find(x => x.id == poolId));
}

export function getPoolStandingById(poolId: number): Readable<PoolStanding> {
  var pool$ = getPoolById(poolId);

  return derived(pool$, (p): PoolStanding => {
    const items: PoolStandingItem[] = [];

    p.players.forEach(player => {
      items.push({
        tournamentPlayerId: player.playerTournamentId,
        playerInfo: player.info,
        active: true,
        inactiveReason: undefined,
        gamesLost: 0,
        gamesWon: 0,
        matchesLost: 0,
        matchesWon: 0,
        pointsLost: 0,
        pointsWon: 0,
        position: 0,
        points: 0,
        rank: 0,
        rolloverWins: 0,
        rolloversLost: 0,
      })
    });

    for (var i = 0; i < items.length; ++i) {
      items[i].rank = 1;
      items[i].position = (i + 1);
    }

    return {
      poolId: poolId,
      poolName: p.name,
      items,
    };
  });
}

function MustBeNumber(tournamentId: number) {
  if (typeof tournamentId !== "number") {
    throw new Error("tournamentId must be a number");
  }
}
