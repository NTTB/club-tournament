export interface PoolStandingItem {
  /**
   * The id of the player.
   */
  tournamentPlayerId: number;

  /**
   * The position in the ranking. Often decided by rank.
   */
  position: number;

  /**
   * The rank in the standing. Always based on results of the player.
   */
  rank: number;

  /**
   * Is the player an active participant?
   */
  active: boolean;

  /**
   * What is the reason the player is in active
   */
  inactiveReason: undefined | string;

  /**
   * The score the player achieved by playing.
   */
  points: number;
  /**
   * The matches won (including rollover)
   */
  matchesWon: number;

  /**
   * The matches lost (including rollover)
   */
  matchesLost: number;

  /**
   * Matches won due to opponent being rollover.
   */
  rolloverWins: number;
  /**
   * Matches lost due to rollover.
   */
  rolloversLost: number;
  /**
   * Total games won.
   */
  gamesWon: number;

  /**
   * Total games lost.
   */
  gamesLost: number;

  /**
   * Total points made in games (so at least 11 if straight win)
   */
  pointsWon: number;

  /**
   * Total ppints lost in games (so at least 11 if no points made)
   */
  pointsLost: number;
}