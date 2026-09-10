import { NextRequest, NextResponse } from "next/server";
import { recruitmentPipelineService } from "@/server/services/employer/recruitmentPipelineService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requisitionId = searchParams.get("requisitionId") || undefined;
    const stage = (searchParams.get("stage") as any) || undefined;
    const search = searchParams.get("search") || undefined;

    const candidates = await recruitmentPipelineService.getPipelineCandidates({ requisitionId, stage, search });
    return NextResponse.json({ success: true, count: candidates.length, data: candidates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    if (body.action === "UPDATE_STAGE") {
      const updated = await recruitmentPipelineService.updateCandidateStage(
        body.applicationId,
        body.stage,
        body.notes,
        auth
      );
      return NextResponse.json({ success: true, data: updated });
    } else if (body.action === "ADD_TAG") {
      const updated = await recruitmentPipelineService.tagCandidate(body.applicationId, body.tag, auth);
      return NextResponse.json({ success: true, data: updated });
    } else if (body.action === "RATE") {
      const updated = await recruitmentPipelineService.rateCandidate(body.applicationId, body.rating, auth);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid pipeline action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
