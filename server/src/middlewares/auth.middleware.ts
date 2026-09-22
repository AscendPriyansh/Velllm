import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Authentication required"
        });
    };

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decoded.userId || typeof decoded.userId !== "string") {
            return res.status(401).json({
                error: "Invalid token",
            });
        }

        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(401).json({
            error: "Invalid token"
        });
    };
};