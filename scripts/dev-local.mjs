import { spawn } from "node:child_process";
import { createConnection } from "node:net";

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
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await canConnect(5432)) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error("The local CAREERIS database did not start within 30 seconds.");
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
