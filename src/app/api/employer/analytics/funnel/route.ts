import { NextRequest, NextResponse } from "next/server";
import { recruitmentAnalyticsService } from "@/server/services/employer/recruitmentAnalyticsService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get("employerId") || "comp-tata-motors";

    const analytics = await recruitmentAnalyticsService.getFunnelAnalytics(employerId);
    return NextResponse.json({ success: true, data: analytics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
