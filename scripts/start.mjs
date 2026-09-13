#!/usr/bin/env node
/**
 * Cross-platform dev launcher (macOS / Linux / Windows via node).
 * Usage: pnpm start:unix
 */
import { execSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const isWin = process.platform === "win32";

function run(cmd, opts = {}) {
  execSync(cmd, { cwd: root, stdio: "inherit", ...opts });
}

function killPort(port) {
  try {
    if (isWin) {
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8", cwd: root });
      const pids = new Set();
      for (const line of out.split("\n")) {
        const m = line.trim().match(/\s(\d+)\s*$/);
        if (m) pids.add(m[1]);
      }
      for (const pid of pids) {
        if (pid !== "0") execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore", cwd: root });
      }
    } else {
      execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, {
        cwd: root,
        shell: "/bin/bash",
        stdio: "ignore",
      });
    }
  } catch {
    /* port free */
  }
}

console.log("\n  Drawboard — starting full stack");
console.log("  Frontend  -> http://localhost:3000");
console.log("  HTTP API  -> http://localhost:3001");
console.log("  WebSocket -> ws://localhost:8080\n");

for (const port of [3000, 3001, 8080]) killPort(port);

if (!existsSync(join(root, "node_modules"))) {
  console.log("  Installing dependencies (first run)...");
  run("pnpm install --config.confirmModulesPurge=false");
}

console.log("  Generating Prisma client...");
run("pnpm exec prisma generate --schema packages/db/prisma/schema.prisma");

console.log("  Starting frontend + HTTP + WebSocket...\n");

setTimeout(() => {
  const open = isWin ? "start http://localhost:3000" : process.platform === "darwin" ? "open http://localhost:3000" : "xdg-open http://localhost:3000";
  try {
    execSync(open, { cwd: root, shell: true, stdio: "ignore" });
  } catch {
    /* optional */
  }
}, 12000);

const child = spawn("pnpm", ["turbo", "dev", "--filter=drawboard-frontend", "--filter=http-backend", "--filter=ws-backend"], {
  cwd: root,
  stdio: "inherit",
  shell: isWin,
});

child.on("exit", (code) => process.exit(code ?? 0));
