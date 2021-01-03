import type { GameResult } from "./game-result";

/**
 * A game to 11/15/21
 */
export interface MatchGame {
  homeScore: number;
  awayScore: number;
  result: GameResult;
}