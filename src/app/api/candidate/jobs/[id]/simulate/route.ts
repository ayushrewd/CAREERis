import { NextRequest, NextResponse } from "next/server";
import { jobMatchSimulationService } from "@/server/services/career/jobMatchSimulationService";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const skillId = body.skillId || "skill-ros";
    const proficiency = body.proficiency || "ADVANCED";
    const candidateId = body.candidateId || "user-cand-01";

    const simulation = await jobMatchSimulationService.simulateSkillAddition(params.id, skillId, proficiency, candidateId);
    return NextResponse.json({ success: true, data: simulation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
