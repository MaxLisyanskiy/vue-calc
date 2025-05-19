import { httpServer } from "./http_server";
import { WebsocketServer } from "./websocket_server";

const HTTP_PORT = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 8181;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT ? parseInt(process.env.WEBSOCKET_PORT) : 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

export class App {
  private httpServer: any;
  private ws: WebsocketServer;

  constructor() {
    this.httpServer = httpServer.listen(HTTP_PORT);
    this.ws = new WebsocketServer(WEBSOCKET_PORT);
  }
}
