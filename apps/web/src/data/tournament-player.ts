import type { PlayerInfo } from "./player-info";

export interface TournamentPlayer {
  id: number; // The id in the tournament.
  tournamentId: number; // The id of the tournament.
  nttbId?: number; // Bondsnumber
  info: PlayerInfo;
}
