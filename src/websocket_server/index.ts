import WebSocket, { WebSocketServer } from "ws";
import { PlayersManager } from "../models/player/player";
import { createUniqueId } from "../utils/createUniqueId";

enum COMMANDS {
  REG = "reg",
  CREATE = "create_room",
  ADD_USER = "add_user_to_room",
  ADD_SHIP = "add_ships",
}

class WebsocketServer {
  private connections: Map<number, WebSocket> = new Map();
  private wss: WebSocketServer;
  private playersManager: PlayersManager;

  constructor(port: number) {
    this.playersManager = new PlayersManager();
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
    const messageData = JSON.parse(data.toString("utf8"));
    const actionType = messageData.type as COMMANDS;

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
  }

  private handleRegistration(data: string, id: number) {
    const currentPlayerData = JSON.parse(data);
    const checkName = this.playersManager.checkExistPlayer(currentPlayerData.name);
    console.log(currentPlayerData);

    if (!checkName) {
      this.playersManager.addNewPlayer(
        this.connections.get(id)!,
        currentPlayerData.name,
        currentPlayerData.password
      );
    }

    const player = this.playersManager.getPlayerByName(currentPlayerData.name);
    if (currentPlayerData.password !== player!.password) {
      const messageOut = `Registration failed for ${player!.name}`;
      this.connections.get(id)!.send(messageOut);
    } else {
      const messageOut = `Registration successful for ${player!.name}`;
      this.connections.get(id)!.send(messageOut);
      console.log(messageOut);
    }
  }

  private handleCreateRoom(id: number) {
    const roomId = createId();
    const playerData = this.playersManager.getUserByConnection(this.connections.get(id)!);
    // Assuming createRoom is defined elsewhere
    createRoom(roomId, playerData!.name, playerData!.index);
    const messageOut = roomsInfoMessage();
    console.log(messageOut);
    this.connections.get(id)!.send(messageOut);
  }

  private handleAddUserToRoom(data: string, id: number) {
    const messageIn = JSON.parse(data);
    const playerData = this.playersManager.getUserByConnection(this.connections.get(id)!);
  }

  private handleAddShips(data: string) {
    const messageIn = JSON.parse(data);
  }

  private handleClose(id: number) {
    this.connections.delete(id);
    console.log(`Connection with id #${id} closed`);
  }
}

export { WebsocketServer };

// Start the HTTP server
// const HTTP_PORT = 8181;
// console.log(`Start static http server on the http://localhost:${HTTP_PORT}/ port`);
// httpServer.listen(HTTP_PORT);

// // Start the WebSocket server
// const websocketServer = new WebsocketServer(3000);

// export const handleStartWebsocket = (port: number) => {
//   const server = new WebSocket.Server({ port });

//   server.on("listening", () => {
//     console.log(`Socket server start: http://localhost:${port}/\n`);
//   });

//   server.on("close", () => {
//     console.log("Socket server closed.\n");
//   });

//   server.on("error", (e) => {
//     console.log("Server socket error:", e, "\n");
//   });

//   server.on("connection", (ws) => {
//     const index = ClientsModel.createClient(ws);
//     console.log(`Client established connection: id ${index}\n`);

//     ws.on("message", (message) => {
//       const clientMessage = convertMessageClientToStr(message);
//       console.log(`Client's message: ${clientMessage}\n`);
//       try {
//         handleMessage(server, ws, clientMessage, index);
//       } catch (e) {
//         console.error(e);
//       }
//     });

//     ws.on("close", () => {
//       console.log(`Client disconnection. Id: ${index}\n`);
//       closeConnection(server, index);
//     });
//   });

//   server.on("error", (e) => {
//     console.log(`Server error: ${e}`);
//   });
// };
