import type { Request, Response } from "express";
import { registerUser as registerUserService, loginUser as loginUserService } from "../services/auth.service.js";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, name, email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await registerUserService({
            username,
            name,
            email,
            passwordHash
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });
    }
    catch(err) {
        if(err instanceof Error && err.message === "User already exists") {
            return res.status(409).json({
                error: "User already exists"
            })
        }

        return res.status(500).json({
            error: "Error registering user",
        });
    };
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await loginUserService({ 
            email,
            password
        });

        res.status(200).json({
            message: "User logged in successfully",
            user
        });

    } catch(err) {
        if(err instanceof Error && err.message === "Invalid credentials") {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        return res.status(500).json({
            error: "Error logging in user"
        });
    };
};
