import { NextRequest, NextResponse } from "next/server";
import { careerJourneyService } from "@/server/services/career/careerJourneyService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const milestones = await careerJourneyService.getJourneyMilestones(auth.userId);
    return NextResponse.json({ success: true, count: milestones.length, data: milestones });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
