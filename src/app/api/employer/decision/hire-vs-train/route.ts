import { NextRequest, NextResponse } from "next/server";
import { hireVsTrainDecisionEngine } from "@/server/services/employer/hireVsTrainDecisionEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const evaluation = await hireVsTrainDecisionEngine.evaluateDecision(body);
    return NextResponse.json({ success: true, data: evaluation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
