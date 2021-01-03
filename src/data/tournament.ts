import { writable, get, Readable, derived } from 'svelte/store';
import { getPoolsFromTournament, startPoolById, deletePool } from './pool-functions';
import { getPlayersFromTournament, removePlayerFromTournament } from './tournament-player-functions';
import type { PoolSettings } from './pool-settings';

export interface Tournament {
  id: number; // Primary key
  name: string;
  availableTables: number;
  defaultPoolSettings: PoolSettings;
  started: boolean;
}

interface TournamentStorageTable {
  nextId: number;
  items: Tournament[];
}

export let META = { nextId: 1 };
export const tournamentStorageTable = writable<TournamentStorageTable>({
  nextId: 1,
  items: []
});

try {
  const data = JSON.parse(localStorage.getItem("data.tournament")) as TournamentStorageTable;
  tournamentStorageTable.set(data || {
    nextId: 1,
    items: []
  });
} catch {
  console.info("No tournaments");
}


tournamentStorageTable.subscribe(values => {
  localStorage.setItem("data.tournament", JSON.stringify(values, undefined, 2));
});

export async function addTournament(data: Tournament): Promise<Tournament> {
  if (data.id !== 0) { throw new Error("The id is already set"); }

  return new Promise<Tournament>((resolve) => {
    tournamentStorageTable.update(table => {
      var newId = table.nextId++;
      data.id = newId;
      table.items = [...table.items, data];
      resolve(data);
      return table;
    });
  });
}

export async function updateTournament(data: Tournament): Promise<Tournament> {
  if (data.id === 0) { throw new Error("The data has no id"); }

  return new Promise<Tournament>((resolve) => {
    tournamentStorageTable.update(table => {
      const ix = table.items.findIndex(x => x.id == data.id);
      if (ix === -1) {
        table.items.push(data);
      } else {
        table.items.splice(ix, 1, data);
      }
      resolve(data);
      return table;
    });
  });
}

export async function deleteTournament(data: Tournament): Promise<void> {
  if (data.id === 0) { throw new Error("The data has no id"); }

  var pools = get(getPoolsFromTournament(data.id));
  pools.forEach(pool => {
    deletePool(pool);
  });

  var players = get(getPlayersFromTournament(data.id));
  players.forEach(p => {
    removePlayerFromTournament(data.id, p);
  });

  return new Promise((resolve) => {
    tournamentStorageTable.update(table => {
      table.items = [...table.items.filter(x => x.id != data.id)];
      resolve();
      return table;
    });
  });
}

export async function findTournamentById(id: number): Promise<Tournament> {
  return Promise.resolve(get(tournamentStorageTable).items.find(x => x.id == id));
}

export async function startTournament(tournamentId: number) {
  var tournament = await findTournamentById(tournamentId);
  var pools = get(getPoolsFromTournament(tournamentId));
  var somePoolsHaveStarted = pools.some(x => !!x.rounds);
  if (somePoolsHaveStarted) {
    throw new Error("Some pools already have rounds");
  }

  // Start all the pools and then update it
  for (var i = 0; i < pools.length; ++i) {
    const pool = pools[i];
    startPoolById(pool.id, tournament.defaultPoolSettings);
  }

  tournament.started = true;

  await updateTournament(tournament);
}

export function getAllTournaments(): Readable<Tournament[]> {
  return derived(tournamentStorageTable, x => x.items);
}