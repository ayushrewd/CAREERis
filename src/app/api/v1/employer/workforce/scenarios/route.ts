import { NextRequest, NextResponse } from "next/server";
import { workforceIntelligenceService } from "@/server/services/employer/workforceIntelligenceService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const scenarios = await workforceIntelligenceService.getWorkforceScenarios(auth.userId);
    return NextResponse.json({ success: true, count: scenarios.length, data: scenarios });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
