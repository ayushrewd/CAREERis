import { NextRequest } from "next/server";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skill = await skillGraphRepository.findById(params.id);
    if (!skill) {
      return notFoundResponse(`Skill ${params.id} not found`);
    }
    return successResponse(skill);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch skill", "FETCH_ERROR", 500);
  }
}

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
