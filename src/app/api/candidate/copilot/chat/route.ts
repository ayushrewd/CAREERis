import { NextRequest, NextResponse } from "next/server";
import { careerCopilotService } from "@/server/services/career/careerCopilotService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = {
      candidateId: body.candidateId || "user-cand-01",
      message: body.message || "What should I learn next?",
      context: body.context,
    };

    const response = await careerCopilotService.chat(query);
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
