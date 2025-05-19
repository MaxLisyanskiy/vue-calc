"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsManager = void 0;
const createUniqueId_1 = require("../../utils/createUniqueId");
class RoomsManager {
    rooms = new Map();
    createRoom(name, id) {
        const roomId = (0, createUniqueId_1.createUniqueId)();
        const existingRoom = this.findRoomByUserID(id);
        if (!existingRoom) {
            const newRoom = {
                roomId: roomId,
                roomUsers: [{ name, id }],
            };
            this.rooms.set(roomId, newRoom);
            return newRoom;
        }
        return null;
    }
    addUserToRoom(roomId, name, id) {
        const currentRoom = this.rooms.get(roomId);
        if (currentRoom && currentRoom.roomUsers[0].id !== id) {
            const newPlayer = { name, id };
            currentRoom.roomUsers.push(newPlayer);
        }
    }
    findRoomByUserID(playerId) {
        return Array.from(this.rooms.values()).find((room) => room.roomUsers[0].id === playerId);
    }
    findRoomByRoomID(roomId) {
        return this.rooms.get(roomId);
    }
    roomsInfoMessage() {
        const roomsInfo = Array.from(this.rooms.values()).filter((room) => room.roomUsers.length < 2);
        return JSON.stringify({
            type: "update_room",
            data: JSON.stringify(roomsInfo),
            id: 0,
        });
    }
}
exports.RoomsManager = RoomsManager;
