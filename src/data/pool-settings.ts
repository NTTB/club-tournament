import type { TTMatchRules, TTSetRules } from "@nttb/tt-match-ranking";

export interface PoolSettings {
  matchRules: TTMatchRules;
  setRules: TTSetRules;
}
