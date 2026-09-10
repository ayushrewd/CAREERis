import { NextRequest, NextResponse } from "next/server";
import { trainingFunnelService } from "@/server/services/training/trainingFunnelService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId") || undefined;

    if (courseId) {
      const score = await trainingFunnelService.getCourseMarketFitScore(courseId);
      return NextResponse.json({ success: true, data: score });
    }

    const all = await trainingFunnelService.getAllMarketFitScores();
    return NextResponse.json({ success: true, count: all.length, data: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
