import { NextRequest, NextResponse } from "next/server";
import { executiveCommandCenterService } from "@/server/services/government/executiveCommandCenterService";

export async function GET(req: NextRequest) {
  try {
    const digest = await executiveCommandCenterService.getExecutiveDigest();
    return NextResponse.json({ success: true, data: digest });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
