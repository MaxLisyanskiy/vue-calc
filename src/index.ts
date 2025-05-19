import { Server } from "http";
import { httpServer } from "./http_server";
import { WSServer } from "./websocket_server";

const HTTP_PORT = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 8181;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT ? parseInt(process.env.WEBSOCKET_PORT) : 8181;

// console.log(`Start static http server on the ${HTTP_PORT} port!`);
// httpServer.listen(HTTP_PORT);

class App {
  private httpServer: Server;
  private ws: WSServer;

  constructor() {
    this.httpServer = httpServer.listen(HTTP_PORT);
    this.ws = new WSServer(WEBSOCKET_PORT);
  }
}

const app = new App();
