import { NextRequest, NextResponse } from "next/server";
import { whatIfScenarioSimulator } from "@/server/services/government/whatIfScenarioSimulator";

export async function GET(req: NextRequest) {
  try {
    const list = await whatIfScenarioSimulator.getAllSavedScenarios();
    return NextResponse.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await whatIfScenarioSimulator.runSimulation(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
