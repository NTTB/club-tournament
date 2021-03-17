import type { PlayerInfoBase } from "../player-info-base";

export interface CustomPlayer extends PlayerInfoBase {
  type: "custom";
  id: number;
}
