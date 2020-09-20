import { writable } from "svelte/store";
export enum ViewMode {
    tournament,
    players,
    poule
}

export const viewMode = writable<ViewMode>(ViewMode.players);


