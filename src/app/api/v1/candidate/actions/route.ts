import { NextRequest, NextResponse } from "next/server";
import { candidateEmployabilityService } from "@/server/services/career/candidateEmployabilityService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await candidateEmployabilityService.toggleAction(body.actionId, body.isCompleted);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Action not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
