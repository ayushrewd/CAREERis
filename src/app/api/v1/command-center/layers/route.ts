import { NextRequest, NextResponse } from "next/server";
import { executiveCommandCenterService } from "@/server/services/government/executiveCommandCenterService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get("stateCode") || undefined;
    const districtId = searchParams.get("districtId") || undefined;

    const layers = await executiveCommandCenterService.getCommandCenterLayers({ stateCode, districtId });
    return NextResponse.json({ success: true, data: layers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
