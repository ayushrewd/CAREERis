import { NextRequest, NextResponse } from "next/server";
import { groundedPolicyAdvisorService } from "@/server/services/government/groundedPolicyAdvisorService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json().catch(() => ({}));

    const response = await groundedPolicyAdvisorService.askPolicyAdvisor({
      userId: auth.userId,
      query: body.query || "Where are the largest skill gaps in India?",
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
