import { NextRequest, NextResponse } from "next/server";
import { policyScenarioSimulatorService } from "@/server/services/government/policyScenarioSimulatorService";

export async function GET(req: NextRequest) {
  try {
    const scenarios = await policyScenarioSimulatorService.getScenarios();
    return NextResponse.json({ success: true, count: scenarios.length, data: scenarios });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const scenario = await policyScenarioSimulatorService.simulateScenario({
      title: body.title,
      description: body.description,
      scenarioType: body.scenarioType,
      scopeGeography: body.scopeGeography,
      baselineSeats: body.baselineSeats,
      simulatedSeats: body.simulatedSeats,
      baselineSkillGap: body.baselineSkillGap,
      projectedSkillGapReductionPercentage: body.projectedSkillGapReductionPercentage,
      estimatedCostINR: body.estimatedCostINR,
      timeToImpactWeeks: body.timeToImpactWeeks,
      assumptions: body.assumptions,
    });

    return NextResponse.json({ success: true, data: scenario });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
