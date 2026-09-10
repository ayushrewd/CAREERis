import { NextRequest, NextResponse } from "next/server";
import { budgetIntelligenceService } from "@/server/services/government/budgetIntelligenceService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fiscalYear = searchParams.get("fiscalYear") || undefined;
    const schemeCode = searchParams.get("schemeCode") || undefined;
    const stateCode = searchParams.get("stateCode") || undefined;

    const allocations = await budgetIntelligenceService.getAllocations({ fiscalYear, schemeCode, stateCode });
    return NextResponse.json({ success: true, count: allocations.length, data: allocations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
