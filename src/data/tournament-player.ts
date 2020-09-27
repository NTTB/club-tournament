import { writable } from "svelte/store";
import type { PlayerInfo } from "./player-info";

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