import { writable } from "svelte/store";
import type { PlayerInfo } from "./player-info";
import { poules } from './poule';

export interface TournamentPlayer {
  id: number; // The id in the tournament.
  nttbId?: number; // Bondsnumber
  info: PlayerInfo;
}

export let META = { nextId: 1 };
export const tournamentPlayers = writable<TournamentPlayer[]>([]);

try {
  const data = JSON.parse(localStorage.getItem("data.tournamentplayers")) as TournamentPlayer[];
  tournamentPlayers.set(data || []);
} catch {
  console.info("No tournament players");
}

tournamentPlayers.subscribe(values => {
  localStorage.setItem("data.tournamentplayers", JSON.stringify(values, undefined, 2));
});

export function removePlayerFromTournament(player: TournamentPlayer) {
  tournamentPlayers.update((src) => {
    const index = src.findIndex((x) => x.id === player.id);
    src.splice(index, 1);
    return src;
  });

  poules.update((src) => {
    src.every(poule => {
      poule.players = poule.players.filter(x => x.playerTournamentId !== player.id);
    });

    return src;
  })
}