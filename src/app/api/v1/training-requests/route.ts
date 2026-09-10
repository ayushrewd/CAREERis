import { NextRequest, NextResponse } from "next/server";
import { trainingRequestMarketplaceService } from "@/server/services/training/trainingRequestMarketplaceService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const requests = await trainingRequestMarketplaceService.getTrainingRequests();
    return NextResponse.json({ success: true, count: requests.length, data: requests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const newReq = await trainingRequestMarketplaceService.createTrainingRequest({
      employerId: body.employerId || auth.userId,
      employerName: body.employerName,
      roleTargetTitle: body.roleTargetTitle,
      headcountNeeded: body.headcountNeeded,
      requiredSkills: body.requiredSkills,
      targetDistrict: body.targetDistrict,
      timelineWeeks: body.timelineWeeks,
    });

    return NextResponse.json({ success: true, data: newReq });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
