import { NextRequest, NextResponse } from "next/server";
import { interviewPreparationService } from "@/server/services/career/interviewPreparationService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId") || undefined;

    const session = await interviewPreparationService.getPrepSession(jobId);
    return NextResponse.json({ success: true, data: session });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const evaluation = await interviewPreparationService.submitMockAnswer({
      sessionId: body.sessionId || "prep-tata-bms-01",
      questionId: body.questionId || "q-01",
      answerText: body.answerText || "",
    });

    return NextResponse.json({ success: true, data: evaluation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
