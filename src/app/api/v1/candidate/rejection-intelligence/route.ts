import { NextRequest, NextResponse } from "next/server";
import { applicationIntelligenceService } from "@/server/services/career/applicationIntelligenceService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const diagnostics = await applicationIntelligenceService.getRejectionDiagnostics(auth.userId);
    return NextResponse.json({ success: true, count: diagnostics.length, data: diagnostics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
