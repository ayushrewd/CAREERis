import { NextRequest } from "next/server";
import { assessmentService } from "@/server/services/assessmentService";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const asmt = await assessmentService.getAssessmentById(params.id);
    if (!asmt) {
      return notFoundResponse(`Assessment ${params.id} not found`);
    }
    return successResponse(asmt);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch assessment", "FETCH_ERROR", 500);
  }
}
