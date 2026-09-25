import { prisma } from "../lib/prisma.js";

type RoomCreationData = {
    name: string,
    isLive: boolean,
    ownerId: string
};

type AddRoomMemberData = {
    email: string
    roomId: string
};

export const roomCreationService = async (data: RoomCreationData) => {
    const room = await prisma.$transaction(async (tx) => {
        const newRoom = await tx.room.create({
            data: {
                name: data.name,
                isLive: data.isLive,
                ownerId: data.ownerId
            },
        });

        await tx.roomMember.create({
            data: {
                userId: data.ownerId,
                roomId: newRoom.id
            },
        });

        return newRoom;
    });

    return room;
};

export const addRoomMemberService = async (data: AddRoomMemberData) => {
    const member = await prisma.roomMember.create({
        data: {
            userId: data.email,
            roomId: data.roomId
        },
    });

    return member;
};