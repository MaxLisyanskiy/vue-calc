import { WebSocket } from "ws";

export interface Player {
  id: number;
  name: string;
  websocket?: WebSocket;
  password?: string;
  wins?: number;
  gameId?: string | null;
  roomId?: string | null;
  isAuth?: boolean;
}
