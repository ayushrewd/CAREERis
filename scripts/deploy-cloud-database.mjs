import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Client } = pg;
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readEnv(file) {
  const result = {};
  for (const rawLine of readFileSync(resolve(projectRoot, file), "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value.replaceAll("\\n", "\n");
  }
  return result;
}

function quoteIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

function databaseHost(connectionString) {
  return new URL(connectionString).hostname;
}

async function listApplicationTables(client) {
  const result = await client.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename <> '_prisma_migrations'
    ORDER BY tablename
  `);
  return result.rows.map((row) => row.tablename);
}

async function getTableOrder(client, tables) {
  const dependencies = new Map(tables.map((table) => [table, new Set()]));
  const result = await client.query(`
    SELECT child.relname AS child_table, parent.relname AS parent_table
    FROM pg_constraint constraint_record
    JOIN pg_class child ON child.oid = constraint_record.conrelid
    JOIN pg_class parent ON parent.oid = constraint_record.confrelid
    JOIN pg_namespace namespace_record ON namespace_record.oid = child.relnamespace
    WHERE constraint_record.contype = 'f'
      AND namespace_record.nspname = 'public'
  `);

  for (const row of result.rows) {
    if (row.child_table !== row.parent_table && dependencies.has(row.child_table) && dependencies.has(row.parent_table)) {
      dependencies.get(row.child_table).add(row.parent_table);
    }
  }

  const ordered = [];
  const remaining = new Set(tables);
  while (remaining.size > 0) {
    const ready = [...remaining].filter((table) =>
      [...dependencies.get(table)].every((dependency) => !remaining.has(dependency)),
    );
    if (ready.length === 0) {
      throw new Error(`Circular foreign-key dependency detected: ${[...remaining].join(", ")}`);
    }
    ready.sort();
    for (const table of ready) {
      ordered.push(table);
      remaining.delete(table);
    }
  }
  return ordered;
}

async function purgeOperationalTestFixtures(client, label) {
  const fixtureCount = await client.query(`
    SELECT (
      (SELECT COUNT(*) FROM "Company" WHERE name LIKE 'E2E Company %') +
      (SELECT COUNT(*) FROM "TrainingProvider" WHERE name LIKE 'E2E Provider %')
    )::int AS count
  `);
  if (fixtureCount.rows[0].count === 0) return;

  await client.query("BEGIN");
  try {
    const audits = await client.query(`DELETE FROM "AuditLog" WHERE "userId" IS NULL`);
    const companies = await client.query(`DELETE FROM "Company" WHERE name LIKE 'E2E Company %'`);
    const providers = await client.query(`DELETE FROM "TrainingProvider" WHERE name LIKE 'E2E Provider %'`);
    await client.query("COMMIT");
    console.log(
      `${label}: removed ${companies.rowCount} test company, ${providers.rowCount} test provider, and ${audits.rowCount} orphaned test audit record(s).`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function migrateSchema(remoteUrl) {
  const temporaryRoot = mkdtempSync(join(tmpdir(), "careeris-prisma-"));
  try {
    cpSync(resolve(projectRoot, "prisma", "schema.prisma"), join(temporaryRoot, "schema.prisma"));
    cpSync(resolve(projectRoot, "prisma", "migrations"), join(temporaryRoot, "migrations"), { recursive: true });
    const prismaCli = resolve(projectRoot, "node_modules", "prisma", "build", "index.js");
    const result = spawnSync(
      process.execPath,
      [prismaCli, "migrate", "deploy", "--schema", join(temporaryRoot, "schema.prisma")],
      {
        cwd: temporaryRoot,
        env: { ...process.env, DATABASE_URL: remoteUrl, DIRECT_URL: remoteUrl },
        encoding: "utf8",
      },
    );
    if (result.status !== 0) {
      throw new Error(result.stderr || result.stdout || "Prisma migration failed.");
    }
    const summary = `${result.stdout}\n${result.stderr}`
      .split(/\r?\n/)
      .filter((line) => /migration|applied|database schema is up to date/i.test(line))
      .join("\n");
    if (summary) console.log(summary);
  } finally {
    try {
      rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 });
    } catch {
      // Windows can briefly retain Prisma engine handles; the OS temp directory
      // can safely clean this disposable copy later.
    }
  }
}

async function copyRealData(localUrl, remoteUrl) {
  const local = new Client({ connectionString: localUrl });
  const remote = new Client({ connectionString: remoteUrl });
  await Promise.all([local.connect(), remote.connect()]);
  try {
    await purgeOperationalTestFixtures(local, "Local database");
    await purgeOperationalTestFixtures(remote, "Cloud database");
    const localTables = await listApplicationTables(local);
    const remoteTables = new Set(await listApplicationTables(remote));
    const missingTables = localTables.filter((table) => !remoteTables.has(table));
    if (missingTables.length) throw new Error(`Cloud schema is missing tables: ${missingTables.join(", ")}`);

    const orderedTables = await getTableOrder(local, localTables);
    await remote.query("BEGIN");
    let totalRows = 0;
    try {
      for (const table of orderedTables) {
        const rows = (await local.query(`SELECT * FROM ${quoteIdentifier(table)}`)).rows;
        if (rows.length === 0) continue;

        const columns = Object.keys(rows[0]);
        const typeRows = await local.query(
          `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
          [table],
        );
        const columnTypes = new Map(typeRows.rows.map((column) => [column.column_name, column.data_type]));
        const columnSql = columns.map(quoteIdentifier).join(", ");
        for (const row of rows) {
          const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
          const values = columns.map((column) => {
            const value = row[column];
            return columnTypes.get(column) === "json" || columnTypes.get(column) === "jsonb"
              ? JSON.stringify(value)
              : value;
          });
          await remote.query(
            `INSERT INTO ${quoteIdentifier(table)} (${columnSql}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
            values,
          );
        }
        totalRows += rows.length;
        console.log(`${table}: ${rows.length} genuine record(s) transferred`);
      }
      await remote.query("COMMIT");
    } catch (error) {
      await remote.query("ROLLBACK");
      throw error;
    }
    console.log(`Cloud data transfer complete: ${totalRows} existing record(s).`);

    const cloudUsers = await remote.query(`SELECT "fullName", "roleType" FROM "User" ORDER BY "createdAt"`);
    const cloudCompanies = await remote.query(`SELECT name FROM "Company" ORDER BY "createdAt"`);
    const remainingFixtures = await remote.query(`
      SELECT (
        (SELECT COUNT(*) FROM "Company" WHERE name LIKE 'E2E Company %') +
        (SELECT COUNT(*) FROM "TrainingProvider" WHERE name LIKE 'E2E Provider %')
      )::int AS count
    `);
    if (remainingFixtures.rows[0].count !== 0) throw new Error("Operational test fixtures remain in the cloud database.");
    console.log(`Verified cloud accounts: ${cloudUsers.rows.map((user) => `${user.fullName} (${user.roleType})`).join(", ")}`);
    console.log(`Verified cloud companies: ${cloudCompanies.rows.map((company) => company.name).join(", ") || "none"}`);
    console.log("Verified cloud E2E fixture count: 0");
  } finally {
    await Promise.allSettled([local.end(), remote.end()]);
  }
}

const localEnv = readEnv(".env");
const productionEnv = readEnv(".env.production.local");
const localUrl = localEnv.DATABASE_URL;
const remoteUrl = productionEnv.DATABASE_URL_UNPOOLED || productionEnv.POSTGRES_URL_NON_POOLING;

if (!localUrl) throw new Error("Local DATABASE_URL is missing from .env.");
if (!remoteUrl) throw new Error("Direct Neon URL is missing from .env.production.local.");
if (databaseHost(localUrl) === databaseHost(remoteUrl)) {
  throw new Error("Local and cloud database hosts must be different.");
}

console.log("Applying committed Prisma migrations to the cloud database...");
await migrateSchema(remoteUrl);
console.log("Transferring existing database-backed CAREERIS records...");
await copyRealData(localUrl, remoteUrl);
