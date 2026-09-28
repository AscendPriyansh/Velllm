import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { socketAuth } from "./socketAuth.middleware.js";
import { registerRoomHandlers } from "./room.socket.js";

export const initializeSocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer);

    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        registerRoomHandlers(socket);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};