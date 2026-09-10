import { NextRequest } from "next/server";
import { applicationService } from "@/server/services/applicationService";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const result = await applicationService.getApplications({ candidateId: auth.userId });
    return successResponse(result.items, {
      page: 1,
      pageSize: result.items.length,
      total: result.total,
    });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch candidate applications", "FETCH_ERROR", 500);
  }
}
