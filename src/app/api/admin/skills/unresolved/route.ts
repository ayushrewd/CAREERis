import { NextRequest } from "next/server";
import { resolveAuthContext, checkPermission } from "@/server/middleware/authContext";
import { adminSkillGovernanceService } from "@/server/services/skill/adminSkillGovernanceService";
import { successResponse, forbiddenResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (!checkPermission(auth, "council:manage_skill_standards") && auth.userRole !== "PLATFORM_ADMIN") {
      return forbiddenResponse("Unauthorized to review unresolved skill quarantine queue");
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const result = await adminSkillGovernanceService.getUnresolvedSkills(status as any);
    return successResponse(result.items, {
      pagination: {
        page: 1,
        pageSize: 50,
        totalItems: result.total,
        totalPages: Math.ceil(result.total / 50),
      },
    });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch unresolved skills", "FETCH_ERROR", 500);
  }
}
