import WebSocket from "ws";
import { createUniqueId } from "../../utils/createUniqueId";
import { Player } from "./player.type";

export class PlayersManager {
  private players: Map<number, Player> = new Map();

  public addNewPlayer(socket: WebSocket, name: string, password: string): Player {
    const id = createUniqueId();

    const newPlayer: Player = {
      id,
      name: name ?? "",
      websocket: socket,
      password: password,
      wins: 0,
      gameId: null,
      roomId: null,
      isAuth: true,
    };

    this.players.set(id, newPlayer);

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

  public updateWinners() {
    const winnersInfo = Array.from(this.players.values()).map((player) => ({
      name: player.name,
      wins: player.wins,
    }));

    const answer = {
      type: "update_winners",
      data: JSON.stringify(winnersInfo),
      id: 0,
    };

    return JSON.stringify(answer);
  }
}
