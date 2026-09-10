import { NextRequest, NextResponse } from "next/server";
import { whatIfScenarioSimulator } from "@/server/services/government/whatIfScenarioSimulator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const scenarioIds = body.scenarioIds || [];
    const comparison = await whatIfScenarioSimulator.compareScenarios(scenarioIds);
    return NextResponse.json({ success: true, data: comparison });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
