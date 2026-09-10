import { NextRequest, NextResponse } from "next/server";
import { groundedCareerCopilotAdvisorService } from "@/server/services/career/groundedCareerCopilotAdvisorService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json().catch(() => ({}));

    const response = await groundedCareerCopilotAdvisorService.askCareerCopilot({
      candidateId: body.candidateId || auth.userId,
      query: body.query || "Why am I not ready for the EV BMS role?",
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
