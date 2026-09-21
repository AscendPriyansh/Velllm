import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

type RegisterUserData = {
    username: string;
    name: string;
    email: string;
    passwordHash: string;
};

export const registerUser = async (data: RegisterUserData) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { userName: data.username },
                { email: data.email }
            ],
        }
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const user = await prisma.user.create({
        data: {
            userName: data.username,
            name: data.name,
            email: data.email,
            passwordHash: data.passwordHash
        },

        select: {
            id: true,
            userName: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });

    return user;
}

export const loginUser = async (data: { email: string; password: string }) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: data.email },
            ]
        },
    });

    if(!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);

    if(!isMatch) {
        throw new Error("Invalid credentials");
    }

    return user;
};