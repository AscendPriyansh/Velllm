import { z } from "zod";

export const createRoomSchema = z.object({
    name: z.optional(z.string().min(1, "Room name is required").max(100, "Room name must be at most 100 characters long")),
    isLive: z.optional(z.boolean("Room isLive must be a boolean value"))
});

export const addRoomMemberSchema = z.object({
    email: z.string().email("Invalid email address")
});