import { NextRequest, NextResponse } from "next/server";
import { trainingCopilotService } from "@/server/services/training/trainingCopilotService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();
    const query = body.query;

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    const response = await trainingCopilotService.ask({
      userRole: auth.userRole,
      instituteId: body.instituteId,
      courseId: body.courseId,
      districtId: body.districtId,
      query,
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
