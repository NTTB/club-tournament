import { writable } from "svelte/store";
import type { PlayerInfo } from "./player-info";

export interface PoulePlayer {
    playerTournamentId: number; // The id of the player in the tournament
    info: PlayerInfo;
}
export interface Poule {
    name: string;
    index: number; // First, second, third and so on.
    // List of assigned players
    players: PoulePlayer[];

}

export let META = { nextId: 1 };
export const poules = writable<Poule[]>([]);

