import { NextRequest, NextResponse } from "next/server";
import { districtActionPlanService } from "@/server/services/government/districtActionPlanService";
import { getAuthContext } from "@/server/middleware/authContext";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district") || undefined;

    const plans = await districtActionPlanService.getActionPlans(district);
    return NextResponse.json({ success: true, count: plans.length, data: plans });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthContext(req);
    const body = await req.json();

    const newPlan = await districtActionPlanService.createActionPlan({
      district: body.district,
      state: body.state,
      priorityScore: body.priorityScore,
      priorityClassification: body.priorityClassification,
      keyDeficitSkills: body.keyDeficitSkills,
      baselineTrainingCapacitySeats: body.baselineTrainingCapacitySeats,
      targetTrainingCapacitySeats: body.targetTrainingCapacitySeats,
      allocatedBudgetINR: body.allocatedBudgetINR,
      leadOfficerName: body.leadOfficerName || auth.userId,
    });

    return NextResponse.json({ success: true, data: newPlan });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
