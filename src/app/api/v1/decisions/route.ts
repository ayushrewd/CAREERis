import { NextRequest, NextResponse } from "next/server";
import { programmeRiskAndDecisionService } from "@/server/services/programme/programmeRiskAndDecisionService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const decisions = await programmeRiskAndDecisionService.getAllDecisions();
    return NextResponse.json({ success: true, count: decisions.length, data: decisions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const decision = await programmeRiskAndDecisionService.proposeDecision({
      decisionType: body.decisionType || "BUDGET_ALLOCATION",
      targetEntityId: body.targetEntityId,
      targetEntityName: body.targetEntityName,
      requesterId: auth.userId,
      requesterName: auth.fullName,
      requesterRole: auth.userRole,
      reason: body.reason,
      evidenceSummary: body.evidenceSummary,
    });

    return NextResponse.json({ success: true, data: decision });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
