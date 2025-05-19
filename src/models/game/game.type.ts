import { Player } from "../player/player.type";

export type Game = {
  id: number;
  players: Array<Player>;
  fields?: Array<string | null>;
  currentPlayerIndex?: number;
};
