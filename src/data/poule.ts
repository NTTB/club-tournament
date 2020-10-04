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
try {
    const pouleData = JSON.parse(localStorage.getItem("data.poules")) as Poule[];
    poules.set(pouleData || []);
}catch{
    console.info("No previous data");
}

poules.subscribe(values => {
    localStorage.setItem("data.poules", JSON.stringify(values, undefined, 2));
});