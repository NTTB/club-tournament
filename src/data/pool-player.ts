import type { PlayerInfo } from "./player-info";

export interface PoolPlayer {
  /**
   * The id of the player in the tournament.
   * @see TournamentPlayer
   */
  playerTournamentId: number;
  info: PlayerInfo;
}