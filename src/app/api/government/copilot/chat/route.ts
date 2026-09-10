import { NextRequest, NextResponse } from "next/server";
import { policyCopilotService } from "@/server/services/government/policyCopilotService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();
    const query = body.query;

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    const response = await policyCopilotService.ask({
      userRole: auth.userRole,
      userScope: {
        scopeType: auth.userRole === "DISTRICT_ADMIN" ? "DISTRICT" : auth.assignedStateCode ? "STATE" : "NATIONAL",
        stateCode: auth.assignedStateCode || "MH",
        districtId: auth.assignedDistrictId || "dist-pune",
      },
      query,
      contextStateCode: body.contextStateCode,
      contextDistrictId: body.contextDistrictId,
      contextSkillId: body.contextSkillId,
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
