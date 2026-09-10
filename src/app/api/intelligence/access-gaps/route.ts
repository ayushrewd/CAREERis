import { NextRequest, NextResponse } from "next/server";
import { trainingAccessGapService } from "@/server/services/intelligence/decision/trainingAccessGapService";

export async function GET(req: NextRequest) {
  try {
    const stateCode = req.nextUrl.searchParams.get("stateCode") || "MH";
    const gaps = await trainingAccessGapService.getAllAccessGaps(stateCode);
    return NextResponse.json({ success: true, data: gaps });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
