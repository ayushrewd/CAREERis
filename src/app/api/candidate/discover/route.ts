import { NextRequest, NextResponse } from "next/server";
import { careerDiscoveryService } from "@/server/services/career/careerDiscoveryService";

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get("candidateId") || "user-cand-01";
    const recommendations = await careerDiscoveryService.discoverCareers(candidateId);
    return NextResponse.json({ success: true, data: recommendations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
