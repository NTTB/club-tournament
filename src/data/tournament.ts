import { writable, get } from 'svelte/store';

export interface Tournament {
  id: number; // Primary key
  name: string;
  availableTables: number;
  pointsPerMatch: number;
  setsPerMatch: number;
  pointsPerSet: number;
}

interface TournamenStorageTable {
  nextId: number;
  items: Tournament[];
}

export let META = { nextId: 1 };
export const tournamentStorageTable = writable<TournamenStorageTable>({
  nextId: 1,
  items: []
});

try {
  const data = JSON.parse(localStorage.getItem("data.tournament")) as TournamenStorageTable;
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
      table.items = [...table.items.filter(x => x.id != data.id), data];
      resolve(data);
      return table;
    });
  });
}

export async function deleteTournament(data: Tournament): Promise<void> {
  if (data.id === 0) { throw new Error("The data has no id"); }

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

export async function getAllTournaments(): Promise<Tournament[]> {
  return Promise.resolve(get(tournamentStorageTable).items);
}

export const tournamentName = writable<string>("");
export const availableTables = writable<number>(1);
export const pointsPerMatch = writable<number>(2);
export const setsPerMatch = writable<number>(3);
export const pointsPerSet = writable<number>(11);