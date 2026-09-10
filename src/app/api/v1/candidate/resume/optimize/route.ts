import { NextRequest, NextResponse } from "next/server";
import { resumeIntelligenceService } from "@/server/services/career/resumeIntelligenceService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json().catch(() => ({}));

    const optimized = await resumeIntelligenceService.optimizeResumeForJob({
      candidateId: body.candidateId || auth.userId,
      targetJobId: body.targetJobId || "job-ev-calibration-01",
    });

    return NextResponse.json({ success: true, data: optimized });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
