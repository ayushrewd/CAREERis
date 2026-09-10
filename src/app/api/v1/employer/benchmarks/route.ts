import { NextRequest, NextResponse } from "next/server";
import { employerFeedbackAndSurveyService } from "@/server/services/employer/employerFeedbackAndSurveyService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const benchmarks = await employerFeedbackAndSurveyService.getIndustryBenchmarks(auth.userId);
    return NextResponse.json({ success: true, count: benchmarks.length, data: benchmarks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
