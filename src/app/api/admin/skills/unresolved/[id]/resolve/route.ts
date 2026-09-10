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

    const body = await request.json();
    if (!body.targetCanonicalSkillId) {
      return errorResponse("targetCanonicalSkillId is required", "VALIDATION_ERROR", 400);
    }

    const resolved = await adminSkillGovernanceService.resolveUnresolvedSkill(params.id, body.targetCanonicalSkillId);
    if (!resolved) {
      return notFoundResponse(`Unresolved record ${params.id} not found`);
    }

    return successResponse(resolved);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to resolve skill", "RESOLVE_ERROR", 400);
  }
}
