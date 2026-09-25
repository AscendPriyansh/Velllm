import type { Request, Response } from "express";
import { roomCreationService, addRoomMemberService, getRoomService } from "../services/room.service.js";

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
    } catch (err) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    };
};

export const addRoomMember = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const roomId = req.params.roomId;

        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        };

        if (!roomId || typeof roomId !== "string") {
            return res.status(400).json({
                message: "RoomId is required"
            });
        };

        const addMember = await addRoomMemberService({
            email,
            roomId,
            requesterId: req.userId
        });

        return res.status(200).json({
            message: "Member added successfully"
        });

    } catch (err) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    };
};

export const getRoom = async (req: Request, res: Response) => {
    try {
        const roomId = req.params.roomId;

        if (!roomId || typeof roomId !== "string") {
            return res.status(400).json({
                message: "Room ID is required"
            });
        }

        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const room = await getRoomService({
            requesterId: req.userId,
            roomId
        });

        return res.status(200).json({
            message: "Room fetched successfully",
            room
        });
    } catch(err) {
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};