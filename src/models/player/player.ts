import WebSocket from "ws";
import { createUniqueId } from "../../utils/createUniqueId";
import { Player } from "./player.type";

export class PlayersManager {
  private players: Map<number, Player> = new Map();

  public addNewPlayer(socket: WebSocket, name: string, password: string): Player {
    const userId = createUniqueId();

    const newPlayer: Player = {
      name: name || "",
      websocket: socket,
      index: userId,
      password: password,
      wins: 0,
      gameId: null,
      roomId: null,
      isAuth: true,
    };
    this.players.set(userId, newPlayer);

    return newPlayer;
  }

  public checkExistPlayer(playersName: string): boolean {
    return Array.from(this.players.values()).some((player) => player.name === playersName);
  }

  public checkPassword(userPassword: string): boolean {
    return Array.from(this.players.values()).some((player) => player.password === userPassword);
  }

  public getPlayerByName(playerName: string): Player | undefined {
    return Array.from(this.players.values()).find((player) => player.name === playerName);
  }

  public getPlayerById(playerId: number): Player | undefined {
    return this.players.get(playerId);
  }

  public getUserByConnection(socket: WebSocket): Player | undefined {
    return Array.from(this.players.values()).find((player) => player.websocket === socket);
  }
}
