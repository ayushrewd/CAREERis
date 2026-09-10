import { NextRequest } from "next/server";
import { applicationService } from "@/server/services/applicationService";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";
import { CreateApplicationSchema } from "@/server/validators/commonValidators";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get("candidateId") || undefined;
    const jobId = searchParams.get("jobId") || undefined;
    const stage = searchParams.get("stage") || undefined;

    const result = await applicationService.getApplications({ candidateId, jobId, stage });
    return successResponse(result.items, {
      page: 1,
      pageSize: result.items.length,
      total: result.total,
    });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch applications", "FETCH_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    const parsed = CreateApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid application submission", "VALIDATION_ERROR", 400, parsed.error.format());
    }

    const application = await applicationService.submitApplication({
      jobId: parsed.data.jobId,
      coverNote: parsed.data.coverNote,
      selectedEvidenceIds: parsed.data.selectedEvidenceIds,
      auth,
    });

    return successResponse(application, undefined, 201);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to submit application", "SUBMIT_ERROR", 500);
  }
}
