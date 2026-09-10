import { NextRequest } from "next/server";
import { candidateService } from "@/server/services/candidateService";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const profile = await candidateService.getProfile(auth.userId);
    return successResponse(profile.skills || []);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch candidate skills", "FETCH_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    if (!body.skillId || !body.skillName) {
      return errorResponse("skillId and skillName are required", "VALIDATION_ERROR", 400);
    }

    const updated = await candidateService.addSkill({
      userId: auth.userId,
      skill: {
        skillId: body.skillId,
        skillName: body.skillName,
        claimedProficiency: body.claimedProficiency || "INTERMEDIATE",
        verificationStatus: body.verificationStatus || "SELF_ATTESTED",
        evidenceCount: body.evidenceCount || 1,
        verifiedAt: new Date().toISOString(),
      },
      auth,
    });

    return successResponse(updated.skills);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to add skill", "ADD_ERROR", 500);
  }
}
