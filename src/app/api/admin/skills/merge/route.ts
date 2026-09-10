import { NextRequest } from "next/server";
import { resolveAuthContext, checkPermission } from "@/server/middleware/authContext";
import { adminSkillGovernanceService } from "@/server/services/skill/adminSkillGovernanceService";
import { successResponse, forbiddenResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (!checkPermission(auth, "council:manage_skill_standards") && auth.userRole !== "PLATFORM_ADMIN") {
      return forbiddenResponse("Unauthorized to merge canonical skills");
    }

    const body = await request.json();
    const { primarySkillId, secondarySkillId, action } = body;

    if (!primarySkillId || !secondarySkillId) {
      return errorResponse("primarySkillId and secondarySkillId are required", "VALIDATION_ERROR", 400);
    }

    if (action === "preview") {
      const preview = await adminSkillGovernanceService.previewMerge(primarySkillId, secondarySkillId);
      return successResponse(preview);
    }

    // Execute merge
    const result = await adminSkillGovernanceService.executeMerge(primarySkillId, secondarySkillId);
    return successResponse(result);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to merge skills", "MERGE_ERROR", 400);
  }
}
