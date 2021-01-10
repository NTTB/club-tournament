export interface MatchSetCompleteEvent {
  type: "match-set-complete";
  side: "home" | "away";
  reason: "won" | "resign-before-play" | "resign-during-play";
}

export type MatchSetEvent = MatchSetCompleteEvent;