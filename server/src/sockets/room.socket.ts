import type { Socket } from "socket.io";
import { prisma } from "../lib/prisma.js";

export const registerRoomHandlers = (socket: Socket) => {

    socket.on("join-room", async (roomId: string, callback) => {
        try {
            const userId = socket.data.userId;

            const membership = await prisma.roomMember.findUnique({
                where: {
                    userId_roomId: {
                        userId: userId,
                        roomId: roomId
                    }
                }
            });

            if (!membership) {
                return callback({
                    success: false,
                    message: "You are not the member of this room"
                })
            }

            socket.join(roomId);

            socket.to(roomId).emit("user-joined", userId);

            return callback({
                success: true,
                message: "Room joined successfully"
            });
        } catch (err) {
            return callback({
                success: false,
                message: "Something went wrong"
            });
        }
    });

    socket.on("leave-room", async (roomId: string, callback) => {
        try {
            const userId = socket.data.userId;

            socket.leave(roomId);

            socket.to(roomId).emit("user-left", userId);

            return callback({
                success: true,
                message: "User left successfully"
            });
        } catch (err) {
            return callback({
                success: false,
                message: "Something went wrong"
            });
        }
    });


    socket.on("disconnecting", (reason) => {
        try {
            const userId = socket.data.userId;

            if (!userId) {
                console.error("Disconnecting socket has no userId");
                return;
            }

            for (const roomId of socket.rooms) {
                if (roomId === socket.id) continue;

                socket.to(roomId).emit("user-left", {
                    userId
                });
            }

            console.log(`User ${userId} disconnecting: ${reason}`);

        } catch (error) {
            console.error("Error during socket disconnect:", error);
        }
    });
};
