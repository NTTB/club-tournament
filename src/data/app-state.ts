import { writable } from "svelte/store";
export enum ViewMode {
    tournament,
    players,
    planning
}

export const viewMode = writable<ViewMode>(ViewMode.players);


