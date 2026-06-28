import { SignJWT, jwtVerify } from "jose";

export const JWT_SECRET: string = process.env.JWT_SECRET || "dev-secret-change-in-production";
const secret = new TextEncoder().encode(JWT_SECRET);

export interface JwtPayload {
    userId: string;
}

export async function signJwt(userId: string): Promise<string> {
    return new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        if (typeof payload.userId !== "string") return null;
        return { userId: payload.userId };
    } catch {
        return null;
    }
}
