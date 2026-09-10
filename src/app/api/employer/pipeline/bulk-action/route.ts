import { NextRequest, NextResponse } from "next/server";
import { recruitmentPipelineService } from "@/server/services/employer/recruitmentPipelineService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const result = await recruitmentPipelineService.executeBulkAction({
      applicationIds: body.applicationIds || [],
      actionType: body.actionType,
      payload: body.payload,
      auth,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
