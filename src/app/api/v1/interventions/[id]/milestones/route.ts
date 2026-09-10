import { NextRequest, NextResponse } from "next/server";
import { interventionExecutionService } from "@/server/services/programme/interventionExecutionService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const intervention = await interventionExecutionService.getInterventionById(params.id);
    if (!intervention) {
      return NextResponse.json({ success: false, error: "Intervention not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, count: intervention.milestones.length, data: intervention.milestones });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await interventionExecutionService.updateMilestoneProgress(params.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
