import { NextRequest, NextResponse } from "next/server";
import { personalizedJobService } from "@/server/services/career/personalizedJobService";

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get("candidateId") || "user-cand-01";
    const category = request.nextUrl.searchParams.get("category") || undefined;

    const jobs = await personalizedJobService.getRecommendedJobs(candidateId, category);
    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
