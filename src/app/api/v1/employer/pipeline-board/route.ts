import { NextRequest, NextResponse } from "next/server";
import { recruitmentPipelineOpsService } from "@/server/services/employer/recruitmentPipelineOpsService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requisitionId = searchParams.get("requisitionId") || undefined;

    const applications = await recruitmentPipelineOpsService.getPipelineApplications(requisitionId);
    return NextResponse.json({ success: true, count: applications.length, data: applications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const updated = await recruitmentPipelineOpsService.advanceStage(
      body.applicationId,
      body.stage,
      body.notes
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
