import { NextRequest } from "next/server";
import { jobRepository } from "@/server/repositories/jobRepository";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobs = await jobRepository.findAll({ skillId: params.id });
    return successResponse(jobs.items);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch jobs for skill", "FETCH_ERROR", 500);
  }
}
