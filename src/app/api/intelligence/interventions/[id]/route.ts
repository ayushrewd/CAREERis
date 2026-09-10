import { NextRequest, NextResponse } from "next/server";
import { interventionService } from "@/server/services/intelligence/decision/interventionService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await interventionService.getInterventionById(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Intervention not found" }, { status: 404 });
    }
    const evaluation = await interventionService.evaluateOutcome(params.id);
    return NextResponse.json({ success: true, data: { ...item, outcomeEvaluation: evaluation } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { action, approvedBy, approvalNotes, actualValue, markCompleted } = body;

    let updated = null;
    if (action === "APPROVE" || action === "REJECT") {
      updated = await interventionService.reviewIntervention(params.id, action, approvedBy || "usr-gov-sec-01", approvalNotes);
    } else if (actualValue !== undefined) {
      updated = await interventionService.updateProgress(params.id, actualValue, markCompleted);
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Failed to update intervention" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
