"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_server_1 = require("./http_server");
const websocket_server_1 = require("./websocket_server");
const HTTP_PORT = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 8181;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT ? parseInt(process.env.WEBSOCKET_PORT) : 8181;
// console.log(`Start static http server on the ${HTTP_PORT} port!`);
// httpServer.listen(HTTP_PORT);
class App {
    httpServer;
    ws;
    constructor() {
        this.httpServer = http_server_1.httpServer.listen(HTTP_PORT);
        this.ws = new websocket_server_1.WSServer(WEBSOCKET_PORT);
    }
}
const app = new App();
