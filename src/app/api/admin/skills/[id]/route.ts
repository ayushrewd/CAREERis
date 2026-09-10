import { NextRequest } from "next/server";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await skillGraphRepository.update(params.id, body);
    if (!updated) {
      return notFoundResponse(`Skill ${params.id} not found`);
    }
    return successResponse(updated);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to update skill", "UPDATE_ERROR", 400);
  }
}
