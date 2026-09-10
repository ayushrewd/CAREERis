import { NextRequest, NextResponse } from "next/server";
import { candidateDiscoveryService } from "@/server/services/employer/candidateDiscoveryService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requisitionId = searchParams.get("requisitionId") || undefined;
    const district = searchParams.get("district") || undefined;
    const minMatchScore = searchParams.get("minMatchScore") ? parseInt(searchParams.get("minMatchScore")!) : undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;

    const results = await candidateDiscoveryService.searchCandidates({
      requisitionId,
      district,
      minMatchScore,
      sortBy,
    });

    return NextResponse.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
