import { NextRequest, NextResponse } from "next/server";
import { careerAnalyticsService } from "@/server/services/career/careerAnalyticsService";

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get("candidateId") || "user-cand-01";
    const analytics = await careerAnalyticsService.getApplicationAnalytics(candidateId);
    return NextResponse.json({ success: true, data: analytics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
