import { NextRequest } from "next/server";
import { resolveAuthContext, checkPermission } from "@/server/middleware/authContext";
import { adminSkillGovernanceService } from "@/server/services/skill/adminSkillGovernanceService";
import { successResponse, forbiddenResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = resolveAuthContext(request);
    if (!checkPermission(auth, "council:manage_skill_standards") && auth.userRole !== "PLATFORM_ADMIN") {
      return forbiddenResponse("Unauthorized to moderate unresolved skills");
    }

    const rejected = await adminSkillGovernanceService.rejectUnresolvedSkill(params.id);
    if (!rejected) {
      return notFoundResponse(`Unresolved record ${params.id} not found`);
    }

    return successResponse(rejected);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to reject skill", "REJECT_ERROR", 400);
  }
}
