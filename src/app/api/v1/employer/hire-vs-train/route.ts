import { NextRequest, NextResponse } from "next/server";
import { workforceHireVsTrainOpsService } from "@/server/services/employer/workforceHireVsTrainOpsService";

export async function GET(req: NextRequest) {
  try {
    const analysis = await workforceHireVsTrainOpsService.getHireVsTrainAnalysis();
    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const analysis = await workforceHireVsTrainOpsService.getHireVsTrainAnalysis();
    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
