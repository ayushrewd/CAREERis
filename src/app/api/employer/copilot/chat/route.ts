import { NextRequest, NextResponse } from "next/server";
import { recruitmentCopilotService } from "@/server/services/employer/recruitmentCopilotService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const employerId = body.employerId || "comp-tata-motors";
    const query = body.query;

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    const response = await recruitmentCopilotService.ask({
      employerId,
      query,
      contextRequisitionId: body.contextRequisitionId,
      contextRoleId: body.contextRoleId,
      contextSkillId: body.contextSkillId,
      contextDistrict: body.contextDistrict,
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
