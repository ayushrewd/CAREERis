import { NextRequest, NextResponse } from "next/server";
import { trainingCapacityService } from "@/server/services/training/trainingCapacityService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get("stateCode") || undefined;
    const districtId = searchParams.get("districtId") || undefined;

    const capacity = await trainingCapacityService.getCapacityOverview({ stateCode, districtId });
    return NextResponse.json({ success: true, data: capacity });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
