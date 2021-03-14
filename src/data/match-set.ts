import type { MatchGame } from "./match-game";

/**
 * A set of games. Can be "best of" or "fixed amount".
 */
export interface MatchSet {
  orderId: number;
  roundId: number; // Use to seperate sets in
  homeTournamentId: number;
  awayTournamentId: number;
  games: MatchGame[];
  winnerTournamentPlayerId?: number;
  resignTournamentPlayerId?: number;
  resignDuringPlay?: boolean;
}