import { checkDatabaseHealth } from "@/server/db/prisma";
import { successResponse } from "@/server/middleware/apiResponse";

export async function GET() {
  const dbHealth = await checkDatabaseHealth();

  return successResponse({
    status: dbHealth.connected ? "HEALTHY" : "UNAVAILABLE",
    service: "CareerIS National Platform API",
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    database: {
      engine: "PostgreSQL",
      mode: dbHealth.mode,
      connected: dbHealth.connected,
      latencyMs: dbHealth.latencyMs,
    },
    modules: {
      auth: "SESSION_DATABASE_BACKED",
      rbac: "ROUTE_LEVEL",
      vectorDatabase: "NOT_IMPLEMENTED",
      pgvector: "NOT_IMPLEMENTED",
      llm: process.env.OPENAI_API_KEY ? "CONFIGURED_FOR_ASSESSMENT_GENERATION" : "NOT_CONFIGURED",
      forecasting: "INSUFFICIENT_HISTORICAL_DATA",
      auditLogger: "POSTGRESQL_FOR_OPERATIONAL_ACTIONS",
      evidenceStorage: "METADATA_ONLY_NO_BINARY_STORAGE",
    },
  }, undefined, dbHealth.connected ? 200 : 503);
}
