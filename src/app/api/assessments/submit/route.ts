import { NextRequest } from "next/server";
import { assessmentService } from "@/server/services/assessmentService";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";
import { SubmitAssessmentAttemptSchema } from "@/server/validators/commonValidators";

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    const parsed = SubmitAssessmentAttemptSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid test submission", "VALIDATION_ERROR", 400, parsed.error.format());
    }

    const attempt = await assessmentService.submitAttempt({
      assessmentId: parsed.data.assessmentId,
      answers: parsed.data.answers,
      auth,
    });

    return successResponse(attempt, undefined, 201);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to process test attempt", "SUBMIT_ERROR", 500);
  }
}
