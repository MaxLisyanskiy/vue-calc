"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersManager = void 0;
const createUniqueId_1 = require("../../utils/createUniqueId");
class PlayersManager {
    players = new Map();
    addNewPlayer(socket, name, password) {
        const id = (0, createUniqueId_1.createUniqueId)();
        const newPlayer = {
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
    checkExistPlayer(playersName) {
        return Array.from(this.players.values()).some((player) => player.name === playersName);
    }
    checkPassword(userPassword) {
        return Array.from(this.players.values()).some((player) => player.password === userPassword);
    }
    getPlayerByName(playerName) {
        return Array.from(this.players.values()).find((player) => player.name === playerName);
    }
    getPlayerById(playerId) {
        return this.players.get(playerId);
    }
    getUserByConnection(socket) {
        return Array.from(this.players.values()).find((player) => player.websocket === socket);
    }
    updateWinners() {
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
exports.PlayersManager = PlayersManager;
