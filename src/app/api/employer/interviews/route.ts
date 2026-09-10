import { NextRequest, NextResponse } from "next/server";
import { interviewWorkflowService } from "@/server/services/employer/interviewWorkflowService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requisitionId = searchParams.get("requisitionId") || undefined;
    const candidateId = searchParams.get("candidateId") || undefined;
    const status = (searchParams.get("status") as any) || undefined;

    const interviews = await interviewWorkflowService.getInterviews({ requisitionId, candidateId, status });
    return NextResponse.json({ success: true, count: interviews.length, data: interviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const created = await interviewWorkflowService.scheduleInterview(body, auth);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
