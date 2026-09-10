import { NextRequest, NextResponse } from "next/server";
import { careerGoalService } from "@/server/services/career/careerGoalService";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await careerGoalService.removeGoal(params.id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await careerGoalService.updateGoal(params.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
