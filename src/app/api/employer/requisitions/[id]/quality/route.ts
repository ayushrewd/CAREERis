import { NextRequest, NextResponse } from "next/server";
import { jobRequisitionService } from "@/server/services/employer/jobRequisitionService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reqItem = await jobRequisitionService.getRequisitionById(params.id);
    if (!reqItem) {
      return NextResponse.json({ success: false, error: "Requisition not found" }, { status: 404 });
    }
    const qualityScore = jobRequisitionService.calculateQualityScore(reqItem);
    return NextResponse.json({ success: true, data: qualityScore });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
