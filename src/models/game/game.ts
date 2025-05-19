import { Game } from "./game.type";
import { createUniqueId } from "../../utils/createUniqueId";
import { Player } from "../player/player.type";

export class GamesManager {
  private games: Map<number, Game> = new Map();

  public addToGame(gameId: number, player: Player): void {
    const game = this.findGameByID(gameId);
    if (!game) {
      const newGame: Game = { id: gameId, players: [player], fields: [] };
      this.games.set(gameId, newGame);
    } else {
      game.players.push(player);
    }
  }

  public findGameByID(gameId: number): Game | undefined {
    return this.games.get(gameId);
  }

  public createGame(player: Player) {
    const gameId = createUniqueId();
    this.addToGame(gameId, player);
    return JSON.stringify({
      type: "create_game",
      data: JSON.stringify({ idGame: gameId, idPlayer: player.id }),
      id: 0,
    });
  }

  public addShips(gameId: number, ships: string): void {
    const game = this.findGameByID(gameId);

    if (game) {
      game.fields?.push(ships);
    }
  }
}
