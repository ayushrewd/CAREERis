import { NextRequest } from "next/server";
import { employerService } from "@/server/services/employerService";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET() {
  try {
    const list = await employerService.getFeedbacks();
    return successResponse(list);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch feedback", "FETCH_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    if (!body.candidateId || !body.candidateName || !body.performanceScore) {
      return errorResponse("candidateId, candidateName and performanceScore are required", "VALIDATION_ERROR", 400);
    }

    const fb = await employerService.submitFeedback({
      data: {
        candidateId: body.candidateId,
        candidateName: body.candidateName,
        jobRole: body.jobRole || "Specialist",
        hiredAt: body.hiredAt || new Date().toISOString(),
        performanceScore: body.performanceScore,
        observedGaps: body.observedGaps || [],
        feedbackText: body.feedbackText || "",
      },
      auth,
    });

    return successResponse(fb, undefined, 201);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to submit feedback", "SUBMIT_ERROR", 500);
  }
}
