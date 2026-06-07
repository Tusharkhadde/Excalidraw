import jwt from "jsonwebtoken";

export const JWT_SECRET: string = process.env.JWT_SECRET || "dev-secret-change-in-production";

export interface JwtPayload {
    userId: string;
}

export function signJwt(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwt(token: string): JwtPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string") return null;
        if (!decoded || typeof decoded.userId !== "string") return null;
        return { userId: decoded.userId };
    } catch {
        return null;
    }
}
