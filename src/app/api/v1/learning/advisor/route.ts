import { NextRequest, NextResponse } from "next/server";
import { aiLearningAdvisorService } from "@/server/services/training/aiLearningAdvisorService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json().catch(() => ({}));

    const response = await aiLearningAdvisorService.askLearningAdvisor({
      candidateId: body.candidateId || auth.userId,
      query: body.query || "Which course will help me become a BMS technician?",
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
