"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSServer = void 0;
const ws_1 = require("ws");
const player_1 = require("../models/player/player");
const createUniqueId_1 = require("../utils/createUniqueId");
const rooms_1 = require("../models/rooms/rooms");
const game_1 = require("../models/game/game");
var COMMANDS;
(function (COMMANDS) {
    COMMANDS["REG"] = "reg";
    COMMANDS["CREATE"] = "create_room";
    COMMANDS["ADD_USER"] = "add_user_to_room";
    COMMANDS["ADD_SHIP"] = "add_ships";
})(COMMANDS || (COMMANDS = {}));
class WSServer {
    connections = new Map();
    wss;
    playersManager;
    roomsManager;
    gamesManager;
    constructor(port) {
        this.playersManager = new player_1.PlayersManager();
        this.roomsManager = new rooms_1.RoomsManager();
        this.gamesManager = new game_1.GamesManager();
        this.wss = new ws_1.WebSocketServer({ port });
        this.initialize();
    }
    initialize() {
        this.wss.on("connection", (ws) => this.handleConnection(ws));
        console.log(`WebSocket server started on port ${this.wss.options.port}`);
    }
    handleConnection(ws) {
        const id = (0, createUniqueId_1.createUniqueId)();
        this.connections.set(id, ws);
        console.log(`Connection established with id #${id}`);
        ws.on("error", () => {
            console.log("WebSocket error occurred");
        });
        ws.on("message", (data) => this.handleMessage(data, id));
        ws.on("close", () => this.handleClose(id));
    }
    handleMessage(data, id) {
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
        }
        catch (e) {
            console.error(e);
        }
    }
    handleRegistration(data, id) {
        const currentPlayerData = JSON.parse(data);
        const checkName = this.playersManager.checkExistPlayer(currentPlayerData.name);
        console.log(currentPlayerData);
        if (!checkName) {
            this.playersManager.addNewPlayer(this.connections.get(id), currentPlayerData.name, currentPlayerData.password);
        }
        const player = this.playersManager.getPlayerByName(currentPlayerData.name);
        if (currentPlayerData.password !== player.password) {
            const messageOut = `Registration failed for ${player.name}`;
            this.connections.get(id).send(messageOut);
        }
        else {
            const messageOut = `Registration successful for ${player.name}`;
            this.connections.get(id).send(messageOut);
            console.log(messageOut);
        }
    }
    handleCreateRoom(id) {
        const playerData = this.playersManager.getUserByConnection(this.connections.get(id));
        const room = this.roomsManager.createRoom(playerData.name, playerData.id);
        if (room) {
            const messageOut = this.roomsManager.roomsInfoMessage();
            this.connections.get(id).send(messageOut);
        }
    }
    handleAddUserToRoom(data, id) {
        const messageIn = JSON.parse(data);
        const playerData = this.playersManager.getUserByConnection(this.connections.get(id));
        this.roomsManager.addUserToRoom(messageIn.indexRoom, playerData.name, playerData.id);
    }
    handleAddShips(data) {
        const messageIn = JSON.parse(data);
        this.gamesManager.addShips(messageIn.gameId, messageIn.indexPlayer
        // JSON.stringify(messageIn.ships)
        );
    }
    broadcastUpdates() {
        const roomsInfo = this.roomsManager.roomsInfoMessage();
        const winInfo = this.playersManager.updateWinners();
        this.connections.forEach((ws) => {
            ws.send(roomsInfo);
            ws.send(winInfo);
        });
    }
    handleClose(id) {
        this.connections.delete(id);
        console.log(`Connection with id #${id} closed`);
    }
}
exports.WSServer = WSServer;
