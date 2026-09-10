import { NextRequest, NextResponse } from "next/server";
import { modelRegistryService } from "@/server/services/intelligence/modelRegistryService";

export async function GET(req: NextRequest) {
  try {
    const models = await modelRegistryService.getAllModels();
    const backtests = await modelRegistryService.getBacktestReports();

    return NextResponse.json({
      success: true,
      data: {
        models,
        backtestLogs: backtests,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
