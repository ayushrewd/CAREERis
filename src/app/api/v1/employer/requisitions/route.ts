import { NextRequest, NextResponse } from "next/server";
import { skillFirstRequisitionService } from "@/server/services/employer/skillFirstRequisitionService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const requisitions = await skillFirstRequisitionService.getRequisitions(auth.userId);
    return NextResponse.json({ success: true, count: requisitions.length, data: requisitions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const newReq = await skillFirstRequisitionService.createRequisition({
      employerId: body.employerId || auth.userId,
      employerName: body.employerName,
      title: body.title,
      roleId: body.roleId,
      roleTitle: body.roleTitle,
      industry: body.industry,
      district: body.district,
      state: body.state,
      skills: body.skills,
    });

    return NextResponse.json({ success: true, data: newReq });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
