import { NextRequest, NextResponse } from "next/server";
import { personalizedMarketService } from "@/server/services/career/personalizedMarketService";

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get("candidateId") || "user-cand-01";
    const signals = await personalizedMarketService.getPersonalizedSignals(candidateId);
    return NextResponse.json({ success: true, data: signals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
