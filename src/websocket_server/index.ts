import WebSocket, { WebSocketServer } from "ws";
import { PlayersManager } from "../models/player/player";
import { createUniqueId } from "../utils/createUniqueId";
import { RoomsManager } from "../models/rooms/rooms";
import { GamesManager } from "../models/game/game";
import { Player } from "../models/player/player.type";

enum COMMANDS {
  REG = "reg",
  CREATE = "create_room",
  ADD_USER = "add_user_to_room",
  ADD_SHIP = "add_ships",
}

export class WSServer {
  private connections: Map<number, WebSocket> = new Map();
  private wss: WebSocketServer;
  private playersManager: PlayersManager;
  private roomsManager: RoomsManager;
  private gamesManager: GamesManager;

  constructor(port: number) {
    this.playersManager = new PlayersManager();
    this.roomsManager = new RoomsManager();
    this.gamesManager = new GamesManager();
    this.wss = new WebSocketServer({ port });
    this.initialize();
  }

  private initialize() {
    this.wss.on("connection", (ws) => this.handleConnection(ws));
    console.log(`WebSocket server started on port ${this.wss.options.port}`);
  }

  private handleConnection(ws: WebSocket) {
    const id = createUniqueId();
    this.connections.set(id, ws);
    console.log(`Connection established with id #${id}`);

    ws.on("error", () => {
      console.log("WebSocket error occurred");
    });

    ws.on("message", (data) => this.handleMessage(data, id));
    ws.on("close", () => this.handleClose(id));
  }

  private handleMessage(data: WebSocket.Data, id: number) {
    try {
      const messageData = JSON.parse(data.toString("utf8"));
      const actionType = messageData.type;
      console.log(messageData);

      switch (actionType) {
        case COMMANDS.REG:
          this.handleRegistration(messageData.data, id);
          break;
        case COMMANDS.CREATE:
          this.handleCreateRoom(id);
          break;
        case COMMANDS.ADD_USER:
          this.handleAddUserToRoom(messageData.data, id);
          break;
        case COMMANDS.ADD_SHIP:
          this.handleAddShips(messageData.data);
          break;
        default:
          console.log("Unknown action type");
      }

      this.broadcastUpdates();
    } catch (e) {
      console.error(e, e);
    }
  }

  private handleRegistration(data: string, id: number) {
    try {
      const currentPlayerData = JSON.parse(data);
      const checkName = this.playersManager.checkExistPlayer(currentPlayerData.name);
      console.log("currentPlayerData", currentPlayerData);

      if (!checkName) {
        this.playersManager.addNewPlayer(
          this.connections.get(id)!,
          currentPlayerData.name,
          currentPlayerData.password
        );
      }

      const regAnswer = (userName: string, userIndex: number) => {
        const answer = {
          type: "reg",
          data: JSON.stringify({
            name: userName,
            index: userIndex,
            error: false,
            errorText: null,
          }),
          id: 0,
        };
        return JSON.stringify(answer);
      };

      const notRegAnswer = (userName: string, userIndex: number) => {
        const answer = {
          type: "reg",
          data: JSON.stringify({
            name: userName,
            index: userIndex,
            error: true,
            errorText: "Login or password is incorrect",
          }),
          id: 0,
        };
        return JSON.stringify(answer);
      };

      const player = this.playersManager.getPlayerByName(currentPlayerData.name);
      if (currentPlayerData.password !== player!.password) {
        const messageOut = notRegAnswer(player!.name, id);
        this.connections.get(id)!.send(messageOut);
      } else {
        const messageOut = regAnswer(player!.name, id);
        this.connections.get(id)!.send(messageOut);
        console.log(messageOut);
      }
    } catch (e) {
      console.log(e);
    }
  }

  private handleCreateRoom(id: number) {
    const playerData = this.playersManager.getUserByConnection(this.connections.get(id)!);
    const room = this.roomsManager.createRoom(playerData!.name, playerData!.id);
    if (room) {
      const messageOut = this.roomsManager.roomsInfoMessage();
      this.connections.get(id)!.send(messageOut);
    }
  }

  private handleAddUserToRoom(data: string, id: number) {
    const messageIn = JSON.parse(data);
    const playerData = this.playersManager.getUserByConnection(this.connections.get(id)!);
    this.roomsManager.addUserToRoom(messageIn.indexRoom, playerData!.name, playerData!.id);
    const roomInfo = this.roomsManager.findRoomByRoomID(messageIn.indexRoom)!.roomUsers;

    if (roomInfo.length === 2) {
      roomInfo.map((player) => {
        const websocket = this.playersManager.getPlayerById(player.id)?.websocket;
        const messageOut = this.handleCreateGame(player.id);

        websocket?.send(messageOut);
      });
    }
  }

  private handleCreateGame = (playerId: number) => {
    const gameId = createUniqueId();
    const player = this.playersManager.getPlayerById(playerId);

    const answer = {
      type: "create_game",
      data: JSON.stringify({
        idGame: gameId,
        idPlayer: playerId,
      }),
      id: 0,
    };

    this.gamesManager.addToGame(gameId, player as Player);

    return JSON.stringify(answer);
  };

  private handleAddShips(data: string) {
    const messageIn = JSON.parse(data);
    this.gamesManager.addShips(messageIn.gameId, messageIn.indexPlayer);
  }

  private broadcastUpdates() {
    const roomsInfo = this.roomsManager.roomsInfoMessage();
    const winInfo = this.playersManager.updateWinners();
    this.connections.forEach((ws) => {
      ws.send(roomsInfo);
      ws.send(winInfo);
    });
  }

  private handleClose(id: number) {
    this.connections.delete(id);
    console.log(`Connection with id #${id} closed`);
  }
}
