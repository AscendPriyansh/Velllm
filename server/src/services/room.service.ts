import { prisma } from "../lib/prisma.js";

type RoomCreationData = {
    name: string,
    isLive: boolean,
    ownerId: string
};

export const roomCreationService = async (data: RoomCreationData) => {
    const room = await prisma.room.create({
        data: {
            name: data.name,
            isLive: data.isLive, 
            ownerId: data.ownerId
        },
    });

    return room;
};