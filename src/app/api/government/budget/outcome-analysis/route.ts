import { NextRequest, NextResponse } from "next/server";
import { budgetIntelligenceService } from "@/server/services/government/budgetIntelligenceService";

export async function GET(req: NextRequest) {
  try {
    const analysis = await budgetIntelligenceService.getBudgetOutcomeAnalysis();
    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
