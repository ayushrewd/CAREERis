import { NextRequest, NextResponse } from "next/server";
import { skillPrioritizationService } from "@/server/services/career/skillPrioritizationService";

export async function GET(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get("candidateId") || "user-cand-01";
    const targetRoleId = request.nextUrl.searchParams.get("targetRoleId") || "role-bms-lead";

    const prioritized = await skillPrioritizationService.getPrioritizedSkills(candidateId, targetRoleId);
    return NextResponse.json({ success: true, data: prioritized });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
