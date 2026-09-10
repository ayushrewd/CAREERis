import { NextRequest } from "next/server";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { skillGapService } from "@/server/services/skill/skillGapService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    const roleId = body.roleId || "role-bms-lead";
    const candidateId = body.candidateId || auth.userId;

    const analysis = await skillGapService.analyzeCandidateVsRole(candidateId, roleId);
    return successResponse(analysis);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to compute skill gap analysis", "GAP_ANALYSIS_ERROR", 400);
  }
}
