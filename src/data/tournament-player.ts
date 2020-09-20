import { writable } from "svelte/store";
import type { PlayerInfo } from "./player-info";

export interface TournamentPlayer {
    id: number; // The id in the tournament.
    nttbId?: number; // Bondsnumber
    info: PlayerInfo;
}

export let META = { nextId: 1 };
export const tournamentPlayers = writable<TournamentPlayer[]>([]);
