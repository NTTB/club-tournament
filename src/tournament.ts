import { writable, derived } from 'svelte/store';

export enum ViewMode {
    tournament,
    players,
    planning
}

export const viewMode = writable<ViewMode>(ViewMode.tournament);
export const tournamentName = writable<string>("");
export const availableTables = writable<number>(1);
export const pointsPerMatch = writable<number>(2);
export const setsPerMatch = writable<number>(3);
export const pointsPerSet = writable<number>(11);