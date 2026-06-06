import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "@repo/backend-common/config";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export function middleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ message: "Missing authorization header" });
        return;
    }

    const payload = verifyJwt(authHeader);
    if (!payload) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }

    req.userId = payload.userId;
    next();
}
