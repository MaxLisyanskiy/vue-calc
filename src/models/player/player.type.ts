import { WebSocket } from "ws";

export interface Player {
  name: string;
  websocket: WebSocket;
  index: number;
  password: string;
  wins: number;
  gameId: string | null;
  roomId: string | null;
  isAuth: boolean;
}
