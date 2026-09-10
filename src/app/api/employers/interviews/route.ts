import { NextRequest } from "next/server";
import { employerService } from "@/server/services/employerService";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";
import { ScheduleInterviewSchema } from "@/server/validators/commonValidators";

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    const parsed = ScheduleInterviewSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid interview schedule payload", "VALIDATION_ERROR", 400, parsed.error.format());
    }

    const interview = await employerService.scheduleInterview({
      applicationId: parsed.data.applicationId,
      scheduledAt: parsed.data.scheduledAt,
      durationMinutes: parsed.data.durationMinutes,
      format: (parsed.data.format === "IN_PERSON" ? "ON_SITE" : parsed.data.format === "ONLINE_VIDEO" ? "VIDEO_CALL" : parsed.data.format) as any,
      locationOrLink: parsed.data.locationOrLink,
      interviewerName: parsed.data.interviewerName,
      notes: parsed.data.notes,
      auth,
    });

    return successResponse(interview, undefined, 201);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to schedule interview", "SCHEDULE_ERROR", 500);
  }
}
