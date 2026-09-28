import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Socket } from "socket.io";
import "dotenv/config";

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;

    if(!token) {
        next(new Error("Not Authenticated"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        socket.data.userId = decoded.userId;

        next();

    } catch(err) {
        next(new Error("Invalid token"));
    }
};