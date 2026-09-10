import { NextRequest, NextResponse } from "next/server";
import { careerCopilotGroundedService } from "@/server/services/career/careerCopilotGroundedService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const response = await careerCopilotGroundedService.askCareerCopilot({
      candidateId: body.candidateId || auth.userId,
      query: body.query || "What jobs fit me?",
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
