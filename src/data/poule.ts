import { writable } from "svelte/store";

export interface Poule {
}

export const poules = writable<Poule[]>([])
