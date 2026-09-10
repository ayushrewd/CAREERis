import { NextRequest, NextResponse } from "next/server";
import { workforcePlanningService } from "@/server/services/employer/workforcePlanningService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get("employerId") || "comp-tata-motors";

    const plans = await workforcePlanningService.getPlans(employerId);
    return NextResponse.json({ success: true, count: plans.length, data: plans });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const plan = await workforcePlanningService.createPlan(body, auth);
    return NextResponse.json({ success: true, data: plan });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
