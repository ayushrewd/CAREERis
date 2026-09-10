import { NextRequest, NextResponse } from "next/server";
import { trainingProviderActionService } from "@/server/services/training/trainingProviderActionService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const instituteId = searchParams.get("instituteId") || undefined;

    const actions = await trainingProviderActionService.getInstituteActions(instituteId);
    return NextResponse.json({ success: true, count: actions.length, data: actions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
