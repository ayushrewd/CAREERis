import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const databaseDir = resolve(process.cwd(), ".careeris", "postgres");
mkdirSync(databaseDir, { recursive: true });

const postgres = new EmbeddedPostgres({
  databaseDir,
  user: "careeris_user",
  password: "careeris_password",
  port: 5432,
  persistent: true,
  onLog: () => undefined,
  onError: (message) => console.error("[local-db]", message),
});

if (!existsSync(resolve(databaseDir, "PG_VERSION"))) {
  console.log("[local-db] Initializing PostgreSQL for CAREERIS...");
  await postgres.initialise();
}

await postgres.start();

const admin = postgres.getPgClient("postgres");
await admin.connect();
const existing = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", ["careeris_db"]);
await admin.end();
if (existing.rowCount === 0) await postgres.createDatabase("careeris_db");

console.log("[local-db] Ready at postgresql://localhost:5432/careeris_db");
console.log("[local-db] Keep this process running while using CAREERIS.");
await new Promise(() => undefined);
