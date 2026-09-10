import { NextRequest, NextResponse } from "next/server";
import { employerDiscoveryService } from "@/server/services/career/employerDiscoveryService";

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get("candidateId") || "user-cand-01";
    const employers = await employerDiscoveryService.discoverEmployers(candidateId);
    return NextResponse.json({ success: true, data: employers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
