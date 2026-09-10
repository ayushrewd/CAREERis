import { NextRequest, NextResponse } from "next/server";
import { careerTimelineService } from "@/server/services/career/careerTimelineService";

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get("candidateId") || "cand-rohit-01";
    const timeline = await careerTimelineService.getTimeline(candidateId);
    return NextResponse.json({ success: true, data: timeline });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
