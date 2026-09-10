import { NextRequest, NextResponse } from "next/server";
import { districtMatrixService } from "@/server/services/government/districtMatrixService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get("stateCode") || undefined;
    const districtId = searchParams.get("districtId") || undefined;

    if (districtId) {
      const details = await districtMatrixService.getDistrictPriorityDetails(districtId);
      return NextResponse.json({ success: true, data: details });
    }

    const priorities = await districtMatrixService.getDistrictPriorityRanking({ stateCode });
    return NextResponse.json({ success: true, count: priorities.length, data: priorities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
