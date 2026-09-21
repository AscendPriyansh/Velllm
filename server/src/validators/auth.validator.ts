import { z } from "zod";

export const registerUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(30, "Username must be at most 30 characters long"),

    name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters long"),

    email: z.string().email("Invalid email address"),

    password: z.string().min(8, "Password must be at least 8 characters long").max(100, "Password must be at most 100 characters long")
});

export const loginUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(100, "Password must be at most 100 characters long")
});