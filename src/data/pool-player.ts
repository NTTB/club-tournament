import type { PlayerInfo } from "./player-info";

export interface PoolPlayer {
  /**
   * The id of the player in the tournament.
   * @see TournamentPlayer
   */
  playerTournamentId: number;
  /**
   * Information over the player
   */
  info: PlayerInfo;
  /**
   * The order when player has the same rank
   * Default is 0 
   */
  sameRankOrder: number;
}