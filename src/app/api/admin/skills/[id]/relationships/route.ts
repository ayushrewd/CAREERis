import { NextRequest } from "next/server";
import { adminSkillGovernanceService } from "@/server/services/skill/adminSkillGovernanceService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (!body.targetSkillId || !body.relationType) {
      return errorResponse("targetSkillId and relationType are required", "VALIDATION_ERROR", 400);
    }
    const createdRel = await adminSkillGovernanceService.addRelationship(
      params.id,
      body.targetSkillId,
      body.relationType,
      body.weight || 1.0
    );
    return successResponse(createdRel, { statusCode: 201 });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to add relationship", "CREATE_ERROR", 400);
  }
}
