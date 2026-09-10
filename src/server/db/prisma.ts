import { PrismaClient } from "@prisma/client";

// Global singleton for PrismaClient in Next.js development mode
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var isDbConnectedCached: boolean | undefined;
}

export function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

/**
 * Returns true if real PostgreSQL connection is enabled via DATABASE_URL and not explicitly set to demo mode.
 */
export function isPostgresMode(): boolean {
  if (process.env.DATABASE_MODE === "demo") {
    return false;
  }
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes("placeholder") || dbUrl.includes("user:password@localhost:5432")) {
    return false;
  }
  return true;
}

/**
 * Test connectivity to PostgreSQL without throwing an unhandled exception.
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  mode: "POSTGRES" | "DEVELOPMENT_DEMO";
  latencyMs?: number;
  error?: string;
}> {
  if (!isPostgresMode()) {
    return {
      connected: false,
      mode: "DEVELOPMENT_DEMO",
    };
  }

  const start = Date.now();
  try {
    // Attempt simple query
    await prisma.$queryRaw`SELECT 1 as ping`;
    const latencyMs = Date.now() - start;
    return {
      connected: true,
      mode: "POSTGRES",
      latencyMs,
    };
  } catch (err: any) {
    return {
      connected: false,
      mode: "DEVELOPMENT_DEMO",
      error: err?.message || "Connection refused",
    };
  }
}
