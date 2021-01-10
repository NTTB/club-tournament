import type { MatchSetEvent } from "./match-event";
import type { MatchGame } from "./match-game";

/**
 * A set of games. Can be "best of" or "fixed amount".
 */
export interface MatchSet {
  homePlayersIds: number[];
  awayPlayersIds: number[];
  games: MatchGame[];
  events: MatchSetEvent[];
}