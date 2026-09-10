import { NextRequest, NextResponse } from "next/server";
import { programmeEvaluationService } from "@/server/services/programme/programmeEvaluationService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const evaluation = await programmeEvaluationService.getEvaluation(params.id);
    if (!evaluation) {
      return NextResponse.json({ success: false, error: "Evaluation not found for programme" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: evaluation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
