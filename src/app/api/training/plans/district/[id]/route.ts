import { NextRequest, NextResponse } from "next/server";
import { trainingPlanService } from "@/server/services/training/trainingPlanService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const plan = await trainingPlanService.getDistrictTrainingPlan(params.id);
    return NextResponse.json({ success: true, data: plan });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
