import { NextRequest } from "next/server";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { jobRepository } from "@/server/repositories/jobRepository";
import { careerMatchService, JobMatchResult } from "@/server/services/skill/careerMatchService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const candidateId = auth.userId || "user-cand-01";

    const jobsRes = await jobRepository.findAll({ pageSize: 10 });
    const matches: JobMatchResult[] = [];

    for (const job of jobsRes.items) {
      const match = await careerMatchService.matchCandidateToJob(candidateId, job.id);
      matches.push(match);
    }

    matches.sort((a, b) => b.matchBreakdown.overallScore - a.matchBreakdown.overallScore);
    return successResponse(matches);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to generate job recommendations", "RECOMMENDATION_ERROR", 500);
  }
}
