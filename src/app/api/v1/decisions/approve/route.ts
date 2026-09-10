import { NextRequest, NextResponse } from "next/server";
import { programmeRiskAndDecisionService } from "@/server/services/programme/programmeRiskAndDecisionService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();
    const { decisionId } = body;

    if (!decisionId) {
      return NextResponse.json({ success: false, error: "decisionId is required" }, { status: 400 });
    }

    const approved = await programmeRiskAndDecisionService.approveDecision({
      decisionId,
      approverId: auth.userId,
      approverName: auth.fullName,
      approverRole: auth.userRole,
    });

    return NextResponse.json({ success: true, data: approved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
