import { NextRequest, NextResponse } from "next/server";
import { careerComparisonAndSimulationService } from "@/server/services/career/careerComparisonAndSimulationService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json().catch(() => ({}));

    const simulation = await careerComparisonAndSimulationService.simulateCareerPath({
      candidateId: body.candidateId || auth.userId,
      targetRoleId: body.targetRoleId || "role-bms-specialist",
    });

    return NextResponse.json({ success: true, data: simulation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
