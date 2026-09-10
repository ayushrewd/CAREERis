import { NextRequest } from "next/server";
import { assessmentRepository } from "@/server/repositories/assessmentRepository";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessments = await assessmentRepository.findBySkillId(params.id);
    return successResponse(assessments);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch assessments for skill", "FETCH_ERROR", 500);
  }
}
