import { Room } from "./rooms.type";
import { createUniqueId } from "../../utils/createUniqueId";

export class RoomsManager {
  private rooms: Map<number, Room> = new Map();

  public createRoom(name: string, id: number): Room | null {
    const roomId = createUniqueId();
    const existingRoom = this.findRoomByUserID(id);

    if (!existingRoom) {
      const newRoom: Room = {
        roomId: roomId,
        roomUsers: [{ name, id }],
      };
      this.rooms.set(roomId, newRoom);
      return newRoom;
    }
    return null;
  }

  public addUserToRoom(roomId: number, name: string, id: number): void {
    const currentRoom = this.rooms.get(roomId);

    if (currentRoom && currentRoom.roomUsers[0].id !== id) {
      const newPlayer = { name, id };
      currentRoom.roomUsers.push(newPlayer);
    }
  }

  public findRoomByUserID(playerId: number): Room | undefined {
    return Array.from(this.rooms.values()).find((room) => room.roomUsers[0].id === playerId);
  }

  public findRoomByRoomID(roomId: number): Room | undefined {
    return this.rooms.get(roomId);
  }

  public roomsInfoMessage() {
    const roomsInfo = Array.from(this.rooms.values()).filter((room) => room.roomUsers.length < 2);
    return JSON.stringify({
      type: "update_room",
      data: JSON.stringify(roomsInfo),
      id: 0,
    });
  }
}
