import type { MatchSet } from "./match-set";
import type { PoolPlayer } from "./pool-player";
import type { PoolSettings } from "./pool-settings";

export interface PoolRound {
  matches: MatchSet[];
}

export interface Pool {
  id: number;
  tournamentId: number;
  index: number; // First, second, third and so on.
  name: string;

  /**
   * Assigned players in pool.
   */
  players: PoolPlayer[];

  /**
   * The maximum amount of players in this pool.
   * If undefined, then no maximum was set
   */
  maxPlayerCount?: number;

  /**
   * The id of the tables assigned to this pool.
   * If undefined, the no tables are set
   * If empty then this pool has no available table
   * If multiple values are assigned the pool is played on multiple tables.
   */
  tableIds?: number[];

  /**
   * Optional settings for the pool. If not set it will be determined by the 
   * tournament.
   */
  settings?: PoolSettings;

  sets: MatchSet[];
}
