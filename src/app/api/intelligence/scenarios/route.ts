import { NextRequest, NextResponse } from "next/server";
import { scenarioSimulationService } from "@/server/services/intelligence/scenarioSimulationService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await scenarioSimulationService.runScenario({
      scenarioName: body.scenarioName || "Custom Policy Intervention",
      targetScope: body.targetScope || "Pune EV Hub",
      seatDeltaPercentage: body.seatDeltaPercentage !== undefined ? body.seatDeltaPercentage : 25,
      labInvestmentINR: body.labInvestmentINR,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
