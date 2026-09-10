import { NextRequest } from "next/server";
import { adminSkillGovernanceService } from "@/server/services/skill/adminSkillGovernanceService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (!body.alias) {
      return errorResponse("Alias string is required", "VALIDATION_ERROR", 400);
    }
    const createdAlias = await adminSkillGovernanceService.addAlias(params.id, body.alias, body.source || "ADMIN");
    return successResponse(createdAlias, { statusCode: 201 });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to add alias", "CREATE_ERROR", 400);
  }
}
