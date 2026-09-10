import { NextRequest, NextResponse } from "next/server";
import { groundedRecruiterCopilotService } from "@/server/services/employer/groundedRecruiterCopilotService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json().catch(() => ({}));

    const response = await groundedRecruiterCopilotService.askRecruiterCopilot({
      employerId: auth.userId,
      query: body.query || "Find candidates for EV Battery Specialist",
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
