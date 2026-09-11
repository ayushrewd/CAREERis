import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { readFileSync } from "node:fs";

// Explicit local mode must not inherit the cloud URL from Next's .env.local.
for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^\s*(DATABASE_URL|DIRECT_URL|AUTH_SECRET|DATABASE_MODE)\s*=\s*(.*?)\s*$/);
  if (match) process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, '$2');
}
const localUrl = new URL(process.env.DATABASE_URL || '');
if (!['localhost', '127.0.0.1'].includes(localUrl.hostname) || (localUrl.port && localUrl.port !== '5432')) {
  throw new Error('dev:local requires a local DATABASE_URL on port 5432 in .env. Use npm run dev for the configured cloud database.');
}
process.env.DIRECT_URL = process.env.DATABASE_URL;

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const children = new Set();

function run(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });
  children.add(child);
  child.once("exit", () => children.delete(child));
  return child;
}

function canConnect(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host });
    socket.setTimeout(500);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    const unavailable = () => {
      socket.destroy();
      resolve(false);
    };
    socket.once("error", unavailable);
    socket.once("timeout", unavailable);
  });
}

async function waitForDatabase(timeoutMs = 30_000) {
  const { PrismaClient } = await import('@prisma/client');
  const probe = new PrismaClient();
  const deadline = Date.now() + timeoutMs;
  try {
  while (Date.now() < deadline) {
    try { await probe.$queryRawUnsafe('SELECT 1'); return; } catch { /* Wait for database readiness, not just an open port. */ }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error("The local CAREERIS database did not start within 30 seconds.");
  } finally { await probe.$disconnect(); }
}

function waitForExit(child) {
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`Command exited with code ${code}.`)));
  });
}

function stopChildren() {
  for (const child of children) child.kill("SIGTERM");
}

process.once("SIGINT", () => {
  stopChildren();
  process.exit(0);
});
process.once("SIGTERM", () => {
  stopChildren();
  process.exit(0);
});

try {
  if (!(await canConnect(5432))) {
    console.log("[dev:local] Starting the persistent local CAREERIS database...");
    run(npmCommand, ["run", "db:local"]);
  } else {
    console.log("[dev:local] Local database is already running.");
  }

  await waitForDatabase();
  console.log("[dev:local] Applying reproducible Prisma migrations...");
  await waitForExit(run(npxCommand, ["prisma", "migrate", "deploy"]));

  console.log("[dev:local] Starting CAREERIS at http://localhost:3000 ...");
  const web = run(npmCommand, ["run", "dev"]);
  const exitCode = await new Promise((resolve, reject) => {
    web.once("error", reject);
    web.once("exit", (code) => resolve(code ?? 0));
  });
  stopChildren();
  process.exit(exitCode);
} catch (error) {
  console.error("[dev:local]", error instanceof Error ? error.message : error);
  stopChildren();
  process.exit(1);
}
