import { NextRequest } from "next/server";
import { applicationService } from "@/server/services/applicationService";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";
import { UpdateApplicationStageSchema } from "@/server/validators/commonValidators";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = await applicationService.getApplicationById(params.id);
    if (!app) {
      return notFoundResponse(`Application ${params.id} not found`);
    }
    return successResponse(app);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch application", "FETCH_ERROR", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    const parsed = UpdateApplicationStageSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid stage update", "VALIDATION_ERROR", 400, parsed.error.format());
    }

    const updated = await applicationService.updateStage({
      applicationId: params.id,
      newStage: parsed.data.stage as any,
      feedbackNotes: parsed.data.feedbackNotes,
      auth,
    });

    return successResponse(updated);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to update application stage", "STAGE_UPDATE_ERROR", 400);
  }
}
