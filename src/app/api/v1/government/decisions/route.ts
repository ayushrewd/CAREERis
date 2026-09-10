import { NextRequest, NextResponse } from "next/server";
import { districtActionPlanService } from "@/server/services/government/districtActionPlanService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const decisions = await districtActionPlanService.getPolicyDecisions();
    return NextResponse.json({ success: true, count: decisions.length, data: decisions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const decision = await districtActionPlanService.approvePolicyDecision({
      actionPlanId: body.actionPlanId,
      interventionId: body.interventionId,
      decisionTitle: body.decisionTitle,
      decisionMakerName: body.decisionMakerName || auth.userId,
      rationale: body.rationale,
      allocatedBudgetINR: body.allocatedBudgetINR,
      targetSkillGapReductionPercentage: body.targetSkillGapReductionPercentage,
    });

    return NextResponse.json({ success: true, data: decision });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
