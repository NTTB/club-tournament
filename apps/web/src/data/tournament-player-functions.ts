import { writable, derived, Readable, Writable } from "svelte/store";
import type { PlayerInfo } from "./player-info";
import type { TournamentPlayer } from "./tournament-player";

import { removePlayerFromTournamentPool } from "./pool-functions";

export interface TournamentPlayerStorageTable {
  nextId: number;
  items: TournamentPlayer[];
}

const tournamentPlayers = writable<TournamentPlayerStorageTable>({ nextId: 1, items: [] });

try {
  let data = JSON.parse(localStorage.getItem("data.tournamentplayers"));
  if (!Array.isArray(data)) {
    tournamentPlayers.set(data as TournamentPlayerStorageTable || { nextId: 1, items: [] });
  } else {
    console.warn("Old array style data")
  }
} catch {
  console.info("No tournament players");
}

tournamentPlayers.subscribe(values => {
  localStorage.setItem("data.tournamentplayers", JSON.stringify(values, undefined, 2));
});

export function exportTournamentPlayers() {
  return tournamentPlayers;
}

export function importTournamentPlayers(value: TournamentPlayerStorageTable) {
  if (value == null || value == undefined) {
    throw new Error("Value is null or undefined");
  }
  tournamentPlayers.set(value);
}

export function addPlayerToTournament(tournamentId: number, info: PlayerInfo, nttbId?: number) {
  tournamentPlayers.update((src) => {
    src.items.push({
      id: src.nextId++,
      tournamentId,
      nttbId,
      info,
    });
    return src;
  });
}

export function getPlayersFromTournament(tournamentId: number): Readable<TournamentPlayer[]> {
  return derived<Writable<TournamentPlayerStorageTable>, TournamentPlayer[]>(tournamentPlayers, (src) => {
    return src.items.filter(x => x.tournamentId === tournamentId);
  });
}

export function removePlayerFromTournament(tournamentId: number, player: TournamentPlayer) {
  removePlayerFromTournamentPool(player, tournamentId);

  tournamentPlayers.update((src) => {
    const index = src.items.findIndex((x) => x.id === player.id && x.tournamentId == tournamentId);
    src.items.splice(index, 1);
    return src;
  });
}