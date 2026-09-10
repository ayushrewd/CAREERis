import { NextRequest } from "next/server";
import { resolveAuthContext, checkPermission } from "@/server/middleware/authContext";
import { dataSourceRepository } from "@/server/repositories/dataSourceRepository";
import { successResponse, forbiddenResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (!checkPermission(auth, "council:manage_skill_standards") && auth.userRole !== "PLATFORM_ADMIN" && auth.userRole !== "GOVERNMENT_ADMIN") {
      return forbiddenResponse("Unauthorized to view registered data sources");
    }

    const { searchParams } = new URL(request.url);
    const sourceType = searchParams.get("sourceType") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const sources = await dataSourceRepository.findAll({ sourceType, status: status as any, search });
    return successResponse(sources);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch data sources", "SOURCE_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole !== "PLATFORM_ADMIN") {
      return forbiddenResponse("Unauthorized to register data sources");
    }

    const body = await request.json();
    const created = await dataSourceRepository.create({
      code: body.code || `SRC-${Date.now().toString(36).toUpperCase()}`,
      name: body.name,
      sourceType: body.sourceType || "JOB_MARKET",
      publisher: body.publisher || "Authorized Enterprise Partner",
      description: body.description || "",
      collectionMethod: body.collectionMethod || "API Stream",
      frequency: body.frequency || "DAILY",
      coverage: body.coverage || "Regional Hub",
      geographyCoverage: body.geographyCoverage || "PAN_INDIA",
      methodology: body.methodology || "Standard Requisition Ingestion",
      confidence: body.confidence || 0.9,
      license: body.license || "Enterprise Data Sharing",
      status: "HEALTHY",
      isOfficial: body.isOfficial || false,
      isDemoData: body.isDemoData || false,
    });

    return successResponse(created, undefined, 201);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to register data source", "CREATE_ERROR", 400);
  }
}
