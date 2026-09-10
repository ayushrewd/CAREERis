import { NextRequest } from "next/server";
import { resolveAuthContext, checkPermission } from "@/server/middleware/authContext";
import { ingestionJobRepository } from "@/server/repositories/ingestionJobRepository";
import { ingestionEngine } from "@/server/services/intelligence/ingestion/ingestionEngine";
import { successResponse, forbiddenResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (!checkPermission(auth, "council:manage_skill_standards") && auth.userRole !== "PLATFORM_ADMIN" && auth.userRole !== "GOVERNMENT_ADMIN") {
      return forbiddenResponse("Unauthorized to view ingestion jobs");
    }

    const { searchParams } = new URL(request.url);
    const sourceId = searchParams.get("sourceId") || undefined;
    const status = searchParams.get("status") || undefined;

    const jobs = await ingestionJobRepository.findAll({ sourceId, status: status as any });
    return successResponse(jobs);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch ingestion jobs", "JOB_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole !== "PLATFORM_ADMIN") {
      return forbiddenResponse("Unauthorized to execute ingestion jobs");
    }

    const body = await request.json();
    const sourceId = body.sourceId || "src-jobmarket-aggregator";
    const jobResult = await ingestionEngine.runIngestionJob(sourceId, "MANUAL");

    return successResponse(jobResult);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to run ingestion job", "INGESTION_ERROR", 400);
  }
}
