import { NextRequest } from "next/server";
import { roleRepository } from "@/server/repositories/roleRepository";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roles = await roleRepository.findRolesBySkillId(params.id);
    return successResponse(roles);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch roles for skill", "FETCH_ERROR", 500);
  }
}
