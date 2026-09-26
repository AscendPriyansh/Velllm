import { prisma } from "../lib/prisma.js";

type RoomCreationData = {
    name: string,
    isLive: boolean,
    ownerId: string
};

type AddRoomMemberData = {
    email: string
    roomId: string
    requesterId: string
};

type GetRoomData = {
    requesterId: string
    roomId: string
};

type GetUpdateRoomData = {
    requesterId: string
    roomId: string
    name: string
};

type GetUserData = {
    userId: string
    roomId: string
    requesterId: string
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
    const findMember = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    });

    if(!findMember) {
        throw new Error("User not found");
    };

    const room = await prisma.room.findUnique({
        where: {
            id: data.roomId
        }
    });

    if(!room) {
        throw new Error("Room not found");
    }

    if(room.ownerId !== data.requesterId) {
        throw new Error("Only the room member can add members.");
    }

    const existingMember = await prisma.roomMember.findUnique({
        where: {
            userId_roomId: {
                userId: findMember.id,
                roomId: data.roomId
            },
        },
    });

    if(existingMember) {
        throw new Error("Member already exist");
    }

    const member = await prisma.roomMember.create({
        data: {
            userId: findMember.id,
            roomId: data.roomId
        },
    });

    return member;
};

export const getRoomService = async (data: GetRoomData) => {
    const roomMember = await prisma.roomMember.findUnique({
        where: {
            userId_roomId: {
                userId: data.requesterId,
                roomId: data.roomId
            }
        }
    });

    if(!roomMember) {
        throw new Error("User is not part of Room");
    }

    const room = await prisma.room.findUnique({
        where: {
            id: data.roomId
        }
    });

    if(!room) {
        throw new Error("Room doesn't exist");
    }

    return room;
};

export const getAllRoomService = async (data: GetUserData) => {
    const rooms = await prisma.room.findMany({
        where: {
            members: {
                some: {
                    userId: data.userId
                }
            }
        }
    });

    if(!rooms) {
        throw new Error("User don't have rooms");
    }

    return rooms;
};

export const getAllMemberService = async (data: GetRoomData) => {
    const requestMembership = await prisma.roomMember.findUnique({
        where: {
            userId_roomId: {
                userId: data.requesterId,
                roomId: data.roomId
            }
        },
    });

    if(!requestMembership) {
        throw new Error("You are not the member of the Room");
    }

    const members = await prisma.room.findMany({
        where: {
            id: data.roomId
        },
        select: {
            members: {
                select: {
                    user: {
                        select: {
                            name: true,
                            avatarUrl: true
                        }
                    }
                }
            }
        }
    });

    return members;
};

export const removeRoomMemberService = async (data: GetUserData) => {
    const requestMembership = await prisma.roomMember.findUnique({
        where: {
            userId_roomId: {
                userId: data.userId,
                roomId: data.roomId
            }
        }
    });

    if(!requestMembership) {
        throw new Error("Either User is not the member or room doesn't exist");
    }

    const ownerCheck = await prisma.room.findUnique({
        where: {
            id: data.roomId,
            ownerId: data.requesterId,
        }
    });

    if(!ownerCheck) {
        throw new Error("You don't have permission to perform this action")
    }

    const deleteMember = await prisma.roomMember.delete({
        where: {
            userId_roomId: {
                userId: data.userId,
                roomId: data.roomId
            }
        }
    });

    return deleteMember;
};

export const isLiveService = async (data: GetRoomData) => {
    const room = await prisma.room.findUnique({
        where: {
            id: data.roomId,
            ownerId: data.requesterId
        }
    });

    if(!room) {
        throw new Error("Room doesn't exist");
    }

    const toggleStatus = await prisma.room.update({
        where: {
            id: data.roomId
        },
        data: {
            isLive: !room.isLive
        }
    });

    return toggleStatus;
};

export const updateRoomService = async (data: GetUpdateRoomData) => {
    const updateRoom = await prisma.room.update({
        where: {
            id: data.roomId,
            ownerId: data.requesterId
        },
        data: {
            name: data.name
        }
    });

    return updateRoom;
};

export const deleteRoomService = async (data: GetRoomData) => {
    const deleteRoom = await prisma.room.delete({
        where: {
            id: data.roomId,
            ownerId: data.requesterId
        }
    });

    return deleteRoom;
};