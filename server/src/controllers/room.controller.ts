import type { Request, Response } from "express";
import { roomCreationService } from "../services/room.service.js";

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { name, isLive } = req.body;

        if (!req.userId) {
            res.status(401).json({
                error: "Unauthorized"
            });
            return;
        }

        const room = await roomCreationService({
            name,
            isLive,
            ownerId: req.userId
        });

        res.status(201).json({
            message: "Room created successfully",
            room
        });
    } catch(err) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    };
};