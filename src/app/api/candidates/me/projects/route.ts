import { NextRequest } from "next/server";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";
import { evidenceStorageService } from "@/server/services/evidenceStorageService";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const evidence = await evidenceStorageService.getCandidateEvidence(auth.userId);
    return successResponse(evidence);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch candidate projects & evidence", "FETCH_ERROR", 500);
  }
}
