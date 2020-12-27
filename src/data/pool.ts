import { writable, derived } from "svelte/store";
import type { PoolPlayer } from "./pool-player";
import type { PoolSettings } from "./pool-settings";
import type { TournamentPlayer } from "./tournament-player";

export interface Pool {
  id: number;
  tournamentId: number;
  index: number; // First, second, third and so on.
  name: string;

  /**
   * Assigned players in pool
   */
  players: PoolPlayer[];

  /**
   * The maximum amount of players in this pool.
   * If undefined, then no maximum was set
   */
  maxPlayerCount?: number;

  /**
   * The id of the tables assigned to this pool.
   * If undefined, the no tables are set
   * If empty then this pool has no available table
   * If multiple values are assigned the pool is played on multiple tables.
   */
  tableIds?: number[];

  /**
   * Optional settings for the pool. If not set it will be determined by the 
   * tournament.
   */
  settings?: PoolSettings;
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
      players: []
    };
    src.items.push(pool);
    return src;
  });
}

function MustBeNumber(tournamentId: number) {
  if (typeof tournamentId !== "number") {
    throw new Error("tournamentId must be a number");
  }
}
