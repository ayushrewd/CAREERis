import { NextRequest, NextResponse } from "next/server";
import { trainingCapacityService } from "@/server/services/training/trainingCapacityService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const delta = body.deltaPercentage !== undefined ? body.deltaPercentage : 25;
    const result = await trainingCapacityService.runCapacityScenario(delta, body.targetSkillId);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
