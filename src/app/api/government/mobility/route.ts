import { NextRequest, NextResponse } from "next/server";
import { clusterAndMobilityService } from "@/server/services/government/clusterAndMobilityService";

export async function GET(req: NextRequest) {
  try {
    const [transferability, mobility] = await Promise.all([
      clusterAndMobilityService.getCrossIndustryTransferability(),
      clusterAndMobilityService.getPolicyMobilityIntelligence(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...transferability,
        ...mobility,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
