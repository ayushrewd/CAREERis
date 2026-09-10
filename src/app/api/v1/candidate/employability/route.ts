import { NextRequest, NextResponse } from "next/server";
import { candidateEmployabilityService } from "@/server/services/career/candidateEmployabilityService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const scorecard = await candidateEmployabilityService.getScorecard(auth.userId);
    return NextResponse.json({ success: true, data: scorecard });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
