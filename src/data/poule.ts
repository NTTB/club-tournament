import { writable, derived } from "svelte/store";
import type { PlayerInfo } from "./player-info";
import type { TournamentPlayer } from "./tournament-player";

export interface PoulePlayer {
  /**
   * The id of the player in the tournament.
   * @see TournamentPlayer
   */
  playerTournamentId: number;
  info: PlayerInfo;
}

export interface Poule {
  id: number;
  tournamentId: number;
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

interface PouleStorageTable {
  nextId: number;
  items: Poule[];
}

const poules = writable<PouleStorageTable>({ nextId: 1, items: [] });

try {
  const data = (JSON.parse(localStorage.getItem("data.poules")));
  if (!Array.isArray(data)) {
    poules.set(data as PouleStorageTable);
  } else {
    console.warn("Old array style data")
  }
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

export function removePlayerFromTournamentPoule(player: TournamentPlayer, tournamentId: number) {
  if (player.tournamentId != tournamentId) {
    throw new Error("tournamentPlayer is not related to this tournament");
  }

  poules.update(src => {
    src.items
      .filter(x => x.tournamentId === tournamentId)
      .forEach(p => p.players = p.players.filter(x => x.playerTournamentId != player.id));

    return src;
  });
}

export function movePlayerToPoule(player: TournamentPlayer, poule: Poule) {
  if (player.tournamentId != poule.tournamentId) {
    throw new Error("tournamentPlayer can not be moved to a poule from another tournament");
  }
  poules.update(src => {
    // Remove the player from all other poules of that tournament
    src.items
      .filter(x => x.tournamentId === poule.tournamentId)
      .forEach(p => p.players = p.players.filter(x => x.playerTournamentId != player.id));

    if (poule) {
      poule.players.push({ playerTournamentId: player.id, info: player.info });
    }

    return src;
  });
}

export function getPoulesFromTournament(tournamentId: number) {
  return derived(poules, x => x.items.filter(y => y.tournamentId == tournamentId));
}


export function deletePoule(poule: Poule) {
  if (!poule) return;
  poules.update(collection => {
    collection.items = collection.items.filter(x => x.id != poule.id);
    return collection;
  });
}

export function createNewPoule(tournamentId: number) {
  poules.update(src => {
    // Find new key for poule
    var existingPoules = src.items.filter(x => x.tournamentId === tournamentId);
    var nextIndex = existingPoules.map(x => x.index).reduce((pv, cv) => cv > pv ? cv : pv, 0) + 1;

    var poule: Poule = {
      id: src.nextId++,
      tournamentId: tournamentId,
      index: nextIndex,
      name: generatePouleName(nextIndex),
      players: []
    };
    src.items.push(poule);
    return src;
  });
}