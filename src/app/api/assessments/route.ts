import { NextRequest } from "next/server";
import { assessmentService } from "@/server/services/assessmentService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const list = await assessmentService.getAssessments();
    return successResponse(list);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch assessments", "FETCH_ERROR", 500);
  }
}
