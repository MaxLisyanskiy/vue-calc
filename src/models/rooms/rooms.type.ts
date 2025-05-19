import { Player } from "../player/player.type";

export type Room = {
  roomId: number;
  roomUsers: Array<Player>;
};
