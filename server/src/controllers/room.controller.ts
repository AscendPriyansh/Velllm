import type { Request, Response } from "express";
import { roomCreationService, addRoomMemberService, getRoomService, getAllRoomService, getAllMemberService, removeRoomMemberService, isLiveService } from "../services/room.service.js";

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
    } catch (err) {
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const getAllRoom = async (req: Request, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const rooms = await getAllRoomService({
            userId: req.userId,
            roomId: "",
            requesterId: ""
        });

        if (!rooms) {
            return res.status(404).json({
                message: "User is not part of any rooms"
            });
        }

        return res.status(200).json({
            message: "Rooms fetched Successfully",
            rooms
        });

    } catch (err) {
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const getAllMember = async (req: Request, res: Response) => {
    try {
        const roomId = req.params.roomId;

        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!roomId || typeof roomId !== "string") {
            return res.status(400).json({
                message: "Room ID is not present"
            });
        }

        const members = await getAllMemberService({
            requesterId: req.userId,
            roomId
        });

        if (!members) {
            return res.status(404).json({
                message: "Something went wrong"
            });
        }

        return res.status(200).json({
            message: "Members fetched successfully",
            members
        });

    } catch (err) {
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const removeRoomMember = async (req: Request, res: Response) => {
    try {
        const roomId = req.params.roomId;
        const userId = req.params.userId;
        const requesterId = req.userId;

        if (!roomId || typeof roomId !== "string") {
            return res.status(400).json({
                message: "Room ID doesn't exist"
            });
        }

        if (!userId || typeof userId !== "string") {
            return res.status(400).json({
                message: "User ID doesn't exist"
            });
        }

        if (!requesterId || typeof requesterId !== "string") {
            return res.status(400).json({
                message: "Unauthorized"
            });
        }

        const member = await removeRoomMemberService({
            userId: userId,
            roomId: roomId,
            requesterId: requesterId
        });

        if(!member) {
            return res.status(400).json({
                message: "Member doesn't exist"
            });
        }

        return res.status(200).json({
            message: "Member removed successfully"
        });

    } catch (err) {
        return res.status(500).json({
            error: "Internal Server Error"
        });
    };
};

export const isLive = async (req: Request, res: Response) => {
    try {
        const roomId = req.params.roomId;
        const requesterId = req.userId;

        if(!roomId || typeof roomId !== "string") {
            return res.status(400).json({
                message: "Room ID doesn't exist"
            });
        };

        if(!requesterId || typeof requesterId !== "string") {
            return res.status(400).json({
                message: "User ID doesn't exist"
            });
        };

        const liveStatus = await isLiveService({
            requesterId: requesterId,
            roomId: roomId
        });

        if(!liveStatus) {
            return res.status(403).json({
                message: "Problem occurred while changing live status"
            });
        }

        return res.status(200).json({
            message: "Room live status changed successfully"
        });

    } catch(err) {
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};