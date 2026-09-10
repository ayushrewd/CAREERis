import { NextRequest, NextResponse } from "next/server";
import { clusterAndMobilityService } from "@/server/services/government/clusterAndMobilityService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get("stateCode") || undefined;

    const clusters = await clusterAndMobilityService.getIndustrialClusters({ stateCode });
    return NextResponse.json({ success: true, count: clusters.length, data: clusters });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
