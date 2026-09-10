import { NextRequest } from "next/server";
import { candidateMatchService } from "@/server/services/skill/candidateMatchService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const jobId = body.jobId || "job-01";
    const candidates = await candidateMatchService.matchCandidatesForJob(jobId);
    return successResponse(candidates);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to match candidates for job", "MATCH_ERROR", 400);
  }
}
