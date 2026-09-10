import { NextRequest, NextResponse } from "next/server";
import { careerisCopilotService } from "@/server/services/intelligence/careerisCopilotService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();
    const query = body.query;

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    const response = await careerisCopilotService.ask({
      userRole: auth.userRole,
      query,
      targetGeography: body.targetGeography,
      targetSkillId: body.targetSkillId,
      targetRoleId: body.targetRoleId,
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
