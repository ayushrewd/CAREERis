import { NextRequest, NextResponse } from "next/server";
import { trainingPartnershipService } from "@/server/services/employer/trainingPartnershipService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const record = await trainingPartnershipService.submitPostHireFeedback({
      candidateId: body.candidateId,
      candidateName: body.candidateName || "Candidate",
      jobRole: body.jobRole || "Specialist",
      performanceScore: body.performanceScore || 90,
      observedGaps: body.observedGaps || [],
      feedbackText: body.feedbackText || "Satisfactory performance.",
      auth,
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
