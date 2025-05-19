"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesManager = void 0;
const createUniqueId_1 = require("../../utils/createUniqueId");
class GamesManager {
    games = new Map();
    addToGame(gameId, player) {
        const game = this.findGameByID(gameId);
        if (!game) {
            const newGame = { id: gameId, players: [player], fields: [] };
            this.games.set(gameId, newGame);
        }
        else {
            game.players.push(player);
        }
    }
    findGameByID(gameId) {
        return this.games.get(gameId);
    }
    createGame(player) {
        const gameId = (0, createUniqueId_1.createUniqueId)();
        this.addToGame(gameId, player);
        return JSON.stringify({
            type: "create_game",
            data: JSON.stringify({ idGame: gameId, idPlayer: player.id }),
            id: 0,
        });
    }
    addShips(gameId, ships) {
        const game = this.findGameByID(gameId);
        if (game) {
            game.fields?.push(ships);
        }
    }
}
exports.GamesManager = GamesManager;
