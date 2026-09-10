import { NextRequest, NextResponse } from "next/server";
import { interviewWorkflowService } from "@/server/services/employer/interviewWorkflowService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const updated = await interviewWorkflowService.submitFeedback(params.id, body.feedback, auth);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
