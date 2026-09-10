import { NextRequest } from "next/server";
import { candidateService } from "@/server/services/candidateService";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";
import { CandidateProfileUpdateSchema } from "@/server/validators/commonValidators";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const profile = await candidateService.getProfile(auth.userId);
    return successResponse(profile);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch candidate profile", "FETCH_ERROR", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    const parsed = CandidateProfileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid profile update payload", "VALIDATION_ERROR", 400, parsed.error.format());
    }

    const updated = await candidateService.updateProfile({
      userId: auth.userId,
      updates: parsed.data,
      auth,
    });
    return successResponse(updated);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to update profile", "UPDATE_ERROR", 500);
  }
}
