import express from "express";
import bcrypt from "bcrypt";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { signJwt } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

function looksLikeBcryptHash(value: string) {
    return /^\$2[aby]\$\d{2}\$/.test(value);
}

// ── Auth ──────────────────────────────────────────────────────

app.post("/signup", async (req, res) => {
    const parsed = CreateUserSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Invalid inputs", errors: parsed.error.flatten() });
        return;
    }

    const { password, name } = parsed.data;
    const email = normalizeEmail(parsed.data.email);

    const existing = await prismaClient.user.findUnique({ where: { email } });
    if (existing) {
        res.status(409).json({ message: "User already exists with this email" });
        return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
        data: { email, password: hashed, name },
    });

    res.status(201).json({ userId: user.id });
});

app.post("/signin", async (req, res) => {
    const parsed = SigninSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Invalid inputs", errors: parsed.error.flatten() });
        return;
    }

    const password = parsed.data.password;
    const email = normalizeEmail(parsed.data.email);

    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }

    const valid = looksLikeBcryptHash(user.password)
        ? await bcrypt.compare(password, user.password)
        : password === user.password;
    if (!valid) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }

    if (!looksLikeBcryptHash(user.password)) {
        const hashed = await bcrypt.hash(password, 10);
        await prismaClient.user.update({
            where: { id: user.id },
            data: { password: hashed },
        });
    }

    const token = signJwt(user.id);
    res.json({ token });
});

// ── User ──────────────────────────────────────────────────────

app.get("/me", middleware, async (req, res) => {
    const user = await prismaClient.user.findUnique({
        where: { id: req.userId },
        select: { id: true, email: true, name: true },
    });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(user);
});

// ── Rooms ─────────────────────────────────────────────────────

app.post("/room", middleware, async (req, res) => {
    const parsed = CreateRoomSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Invalid inputs", errors: parsed.error.flatten() });
        return;
    }

    const slug = parsed.data.slug;
    const existing = await prismaClient.room.findUnique({ where: { slug } });
    if (existing) {
        res.status(409).json({ message: "Room already exists with this slug" });
        return;
    }

    const room = await prismaClient.room.create({
        data: { slug, adminId: req.userId! },
    });

    res.status(201).json({ id: room.id, slug: room.slug });
});

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findUnique({ where: { slug } });
    if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
    }
    res.json({ id: room.id, slug: room.slug, adminId: room.adminId, createdAt: room.createdAt.toISOString() });
});

app.get("/rooms", middleware, async (req, res) => {
    const rooms = await prismaClient.room.findMany({
        where: { adminId: req.userId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
    res.json(rooms.map(r => ({ id: r.id, slug: r.slug, adminId: r.adminId, createdAt: r.createdAt.toISOString() })));
});

// ── Chats / Drawings ─────────────────────────────────────────

app.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    if (Number.isNaN(roomId)) {
        res.status(400).json({ message: "Invalid room id" });
        return;
    }

    const messages = await prismaClient.chat.findMany({
        where: { roomId },
        orderBy: { id: "desc" },
        take: 1000,
    });

    res.json({ messages });
});

app.listen(3001, () => {
    console.log("HTTP backend listening on port 3001");
});
