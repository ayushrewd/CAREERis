import { NextRequest, NextResponse } from "next/server";
import { employerAdvisorService } from "@/server/services/employer/employerAdvisorService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json().catch(() => ({}));

    const response = await employerAdvisorService.askAdvisor({
      employerId: body.employerId || auth.userId,
      query: body.query || "Which skills are hardest to hire?",
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
