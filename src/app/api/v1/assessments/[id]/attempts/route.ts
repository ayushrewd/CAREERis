import { NextRequest, NextResponse } from "next/server";
import { assessmentEngineService } from "@/server/services/training/assessmentEngineService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthContext(req);
    const attempts = await assessmentEngineService.getAttempts(auth.userId);
    return NextResponse.json({ success: true, count: attempts.length, data: attempts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const attempt = await assessmentEngineService.submitAttempt({
      assessmentId: params.id,
      candidateId: body.candidateId || auth.userId,
      candidateName: body.candidateName || "Candidate",
      scorePercentage: body.scorePercentage || 85,
      skillLevelBreakdown: body.skillLevelBreakdown,
    });

    return NextResponse.json({ success: true, data: attempt });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
