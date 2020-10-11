import { writable } from "svelte/store";
import type { PlayerInfo } from "./player-info";
import type { TournamentPlayer } from "./tournament-player";

export interface PoulePlayer {
  playerTournamentId: number; // The id of the player in the tournament
  info: PlayerInfo;
}

export interface Poule {
  name: string;
  index: number; // First, second, third and so on.
  // List of assigned players
  players: PoulePlayer[];

  /**
   * The maximum amount of players in this poule.
   * If undefined, then no maximum was set
   */
  maxPlayerCount?: number;

  /**
   * The id of the tables assigned to this poule.
   * If undefined, the no tables are set
   * If empty then this poule has no available table
   * If multiple values are assigned the poule is played on multiple tables.
   */
  tableIds?: number[];

}

export let META = { nextId: 1 };

export const poules = writable<Poule[]>([]);
try {
  const pouleData = (JSON.parse(localStorage.getItem("data.poules")) || []) as Poule[];
  poules.set(pouleData || []);
  META.nextId = pouleData.length ? (pouleData[pouleData.length - 1].index + 1) : 1;
} catch {
  console.info("No previous data");
}

poules.subscribe(values => {
  localStorage.setItem("data.poules", JSON.stringify(values, undefined, 2));
});
function generatePouleName(n: number) {
  var numbers = [];
  do {
    n -= 1; // Start at 1
    var remainder = n % 26;
    numbers.unshift(remainder);
    n -= remainder;
    n /= 26;
  } while (n != 0);

  var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var letters = [];
  numbers.forEach((element) => {
    letters.push(alpha.charAt(element));
  });
  return letters.join("");
}

export function movePlayerToPoule(player: TournamentPlayer, poule: Poule) {
  poules.update(collection => {
    // Remove the player from all poules
    collection.forEach(p => {
      p.players = p.players.filter(x => x.playerTournamentId != player.id);
    });

    if (poule) {
      poule.players.push({ playerTournamentId: player.id, info: player.info });
    }

    return collection;
  });
}

export function deletePoule(poule: Poule) {
  if (!poule) return;
  poules.update(collection => {
    collection = collection.filter(x => x.index != poule.index);
    return collection;
  });
}

export function createNewPoule() {
  var newPouleId = META.nextId;
  META.nextId++;
  poules.update(collection => {
    var poule: Poule = {
      index: newPouleId,
      name: generatePouleName(newPouleId),
      players: []
    };
    collection.push(poule);
    return collection;
  });
}