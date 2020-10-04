import { writable } from "svelte/store";
export enum ViewMode {
    tournament = "tournament",
    players = "players",
    poule = "poule"
}

export const viewMode = writable<ViewMode>(ViewMode.players);

try {
    viewMode.set(localStorage.getItem("app.viewmode") as ViewMode);
} catch {
    console.info("No previous stored ViewMode");
}

viewMode.subscribe(v=> localStorage.setItem("app.viewmode", v));

