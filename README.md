# Drawboard

**Collaborative whiteboard for teams** — sketch, diagram, and think together in real time.

**Live demo:** [https://drawboard-peach.vercel.app/](https://drawboard-peach.vercel.app/)

**Repository:** [github.com/Tusharkhadde/Excalidraw](https://github.com/Tusharkhadde/Excalidraw)

---

## Table of contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Monorepo architecture](#monorepo-architecture)
- [System architecture](#system-architecture)
- [Apps & packages](#apps--packages)
- [Features](#features)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API & WebSocket](#api--websocket)
- [Database](#database)
- [Deployment](#deployment)

---

## Overview

Drawboard is a real-time collaborative whiteboard built as a **pnpm + Turborepo monorepo**.

| Surface | Role |
|---------|------|
| Next.js frontend | Marketing site, auth, workspace dashboard, canvas board |
| Express HTTP API | Auth, rooms, chat history |
| WebSocket server | Live drawing sync + room chat |
| PostgreSQL + Prisma | Users, rooms, persisted shapes/messages |

Users can draw as a **guest**, or **sign up** to create shared rooms, invite others, export PNG/SVG, and chat while drawing.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Monorepo | **Turborepo** + **pnpm** workspaces |
| Frontend | **Next.js 15** (App Router), **React 19**, TypeScript |
| UI | **Tailwind CSS**, **shadcn/ui** (Radix), Lucide icons, sonner |
| Canvas | Custom HTML5 Canvas engine (`draw/Game.ts`) |
| HTTP API | **Express**, bcryptjs, jose (JWT), CORS |
| Realtime | **ws** (WebSocket) |
| Database | **PostgreSQL** + **Prisma** |
| Tooling | TypeScript project references, ESLint, Prettier, Turbo cache |
| Deploy (frontend) | **Vercel** — [drawboard-peach.vercel.app](https://drawboard-peach.vercel.app/) |

---

## Monorepo architecture

This repo uses **Turborepo** (not Nx / Lerna) on top of **pnpm workspaces**.

```
pnpm-workspace.yaml     → apps/* + packages/*
turbo.json              → build / lint / check-types / dev pipelines
package.json            → root scripts (dev, start, build, db:generate)
```

### Why Turborepo?

- **Cached builds** — unchanged packages skip rebuild
- **Task graph** — `dependsOn: ["^build"]` builds shared packages first
- **Parallel `dev`** — frontend + HTTP + WS run together with one command
- **Filterable** — e.g. `turbo build --filter=drawboard-frontend`

### Dependency flow

```
                    ┌─────────────────────┐
                    │  drawboard-frontend │
                    │  (Next.js :3000)    │
                    └─────────┬───────────┘
                              │  @repo/common, @repo/ui
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  http-backend   │  │   ws-backend    │  │  packages/ui    │
│  (Express:3001) │  │   (ws :8080)    │  │  packages/common│
└────────┬────────┘  └────────┬────────┘  └─────────────────┘
         │                    │
         └─────────┬──────────┘
                   ▼
         ┌─────────────────┐
         │  packages/db    │
         │  Prisma + PG    │
         └─────────────────┘
                   ▲
         packages/backend-common (JWT helpers)
```

---

## System architecture

```
Browser
  │
  ├─ REST ──────────────► http-backend (:3001)
  │                         signup / signin / rooms / chats / me
  │
  └─ WebSocket ─────────► ws-backend (:8080)
                            join_room · draw · update · erase · sync · clear · chat
                                      │
                                      ▼
                              PostgreSQL (Prisma)
                              User · Room · Chat
```

**Local ports**

| Service | Port | URL |
|---------|------|-----|
| Frontend | `3000` | http://localhost:3000 |
| HTTP API | `3001` | http://localhost:3001 |
| WebSocket | `8080` | ws://localhost:8080 |

---

## Apps & packages

### Apps (`apps/`)

| Package | Description |
|---------|-------------|
| `drawboard-frontend` | Next.js app — landing, auth, dashboard, `/canvas/[roomId]` board |
| `http-backend` | Express REST API for auth & rooms |
| `ws-backend` | WebSocket server for live collaboration |
| `web` | Legacy / unused Next stub (not part of `pnpm start`) |

### Packages (`packages/`)

| Package | Description |
|---------|-------------|
| `@repo/db` | Prisma schema + client (`User`, `Room`, `Chat`) |
| `@repo/common` | Shared types & Zod schemas (shapes, auth payloads) |
| `@repo/backend-common` | Shared backend helpers (JWT secret / signing) |
| `@repo/ui` | Shared UI bits (color picker, popover) used by the board |
| `@repo/typescript-config` | Shared `tsconfig` bases |
| `@repo/eslint-config` | Shared ESLint configs |

---

## Features

### Product

- **Guest sketch** — draw instantly at `/canvas/guest` (no account)
- **Auth** — signup / signin with email + password, or **Continue with Google**
- **Workspace** — create rooms, join by link/slug, room cards
- **Live collaboration** — shapes sync over WebSocket for everyone in the room
- **Room chat** — in-board chat with unread badge
- **Export** — PNG (live canvas) and SVG (shape tree)
- **Light / dark board theme** — persisted preference

### Board chrome

- Vertical **tool dock** with single-key shortcuts (`V H P R O D A L T I E`, `Q` lock)
- Contextual **style rail** — stroke swatches, fill, stroke width
- **⌘K / Ctrl+K** command palette
- **`?`** keyboard shortcuts dialog
- Undo / redo, zoom, share link, clear with undo toast

### Drawing tools

Select · Hand · Pencil · Rectangle · Ellipse · Diamond · Arrow · Line · Text · Image · Eraser

---

## Getting started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** 9.x (`npm i -g pnpm`)
- **PostgreSQL** running locally (or a hosted DB URL)

### 1. Clone & install

```bash
git clone https://github.com/Tusharkhadde/Excalidraw.git
cd Excalidraw
pnpm install
```

### 2. Environment

Copy the example env and fill in values:

```bash
# Windows
copy .env.example packages\db\.env
copy .env.example apps\http-backend\.env

# macOS / Linux
cp .env.example packages/db/.env
cp .env.example apps/http-backend/.env
```

Minimum required:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/drawboard?schema=public"
JWT_SECRET="change-me-in-production"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

Optional frontend overrides (create `apps/drawboard-frontend/.env.local` if needed):

```env
NEXT_PUBLIC_HTTP_BACKEND=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database

```bash
pnpm db:generate
pnpm exec prisma db push --schema packages/db/prisma/schema.prisma
```

### 4. Run everything

**One-click (Windows)** — double-click `start.cmd`, or:

```bash
pnpm start
```

**Cross-platform:**

```bash
pnpm start:unix
# or
pnpm dev
```

Then open **http://localhost:3000**.

The start scripts free ports `3000` / `3001` / `8080`, run Prisma generate, and launch all three apps via Turbo.

---

## Environment variables

| Variable | Where | Required | Purpose |
|----------|--------|----------|---------|
| `DATABASE_URL` | `packages/db/.env`, backends | Yes | Postgres connection string |
| `JWT_SECRET` | HTTP + WS backends | Yes | Sign / verify auth tokens |
| `GOOGLE_CLIENT_ID` | `http-backend` | For Google login | Google OAuth Web Client ID |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Frontend | For Google login | Same Client ID (GIS button) |
| `PORT` | `http-backend` | No | Defaults to `3001` |
| `NEXT_PUBLIC_HTTP_BACKEND` | Frontend | No | API base URL |
| `NEXT_PUBLIC_WS_URL` | Frontend | No | WebSocket URL |
| `NEXT_PUBLIC_SITE_URL` | Frontend | No | Canonical URL for OG / sitemap |

See [`.env.example`](./.env.example) for the template.

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm start` | Windows one-click full stack (`scripts/start.ps1`) |
| `pnpm start:unix` | Cross-platform launcher (`scripts/start.mjs`) |
| `pnpm dev` | Turbo: frontend + http-backend + ws-backend |
| `pnpm build` | Turbo build all packages/apps |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm lint` | Lint via Turbo |
| `pnpm format` | Prettier write |

Filter a single app:

```bash
pnpm turbo dev --filter=drawboard-frontend
pnpm turbo build --filter=http-backend
```

---

## API & WebSocket

### HTTP (`http-backend` · `:3001`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/signup` | — | Create account |
| `POST` | `/signin` | — | Login → JWT |
| `POST` | `/auth/google` | — | Google ID token → JWT (signup or signin) |
| `GET` | `/me` | JWT | Current user |
| `POST` | `/room` | JWT | Create room |
| `GET` | `/rooms` | JWT | List my rooms |
| `GET` | `/room/:slug` | — | Resolve room by slug |
| `GET` | `/chats/:roomId` | — | Chat / shape history |
| `GET` | `/users/search` | JWT | Search users |

### WebSocket (`ws-backend` · `:8080`)

Clients authenticate with the JWT, then exchange JSON messages:

| `type` | Direction | Purpose |
|--------|-----------|---------|
| `join_room` | Client → server | Enter a room |
| `leave_room` | Client → server | Leave a room |
| `draw` | Bidirectional | New shape |
| `update` | Bidirectional | Move / edit shape |
| `erase` | Bidirectional | Remove shape(s) |
| `sync` | Bidirectional | Full board sync (undo/redo) |
| `clear` | Bidirectional | Wipe board |
| `chat` | Bidirectional | Room chat message |

---

## Database

Prisma schema lives at [`packages/db/prisma/schema.prisma`](./packages/db/prisma/schema.prisma).

```
User ──┬── Room (admin)
       └── Chat
Room ────── Chat
```

| Model | Purpose |
|-------|---------|
| `User` | id, email, password (optional), name, photo, googleId |
| `Room` | id, unique slug, adminId, createdAt |
| `Chat` | Persisted room messages / drawing payloads |

---

## Deployment

### Frontend (Vercel)

**Production:** [https://drawboard-peach.vercel.app/](https://drawboard-peach.vercel.app/)

Configured via [`vercel.json`](./vercel.json):

- Install: `pnpm install`
- Build: `pnpm turbo run build --filter=drawboard-frontend`
- Framework: Next.js

Set these in the Vercel project:

```env
NEXT_PUBLIC_HTTP_BACKEND=<your-api-url>
NEXT_PUBLIC_WS_URL=<your-ws-url>
NEXT_PUBLIC_SITE_URL=https://drawboard-peach.vercel.app
```

### Backends

Deploy `http-backend` and `ws-backend` to any Node host (Railway, Render, Fly.io, VPS). Point them at the same Postgres `DATABASE_URL` and shared `JWT_SECRET`. Ensure the WS host supports sticky / long-lived WebSocket connections.

---

## License

ISC — see package manifests for details.

---

Built with Turborepo · Next.js · Express · WebSockets · Prisma · PostgreSQL
