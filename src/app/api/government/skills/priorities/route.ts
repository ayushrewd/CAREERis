import { NextRequest, NextResponse } from "next/server";
import { policyPriorityService } from "@/server/services/government/policyPriorityService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get("stateCode") || undefined;

    const priorities = stateCode
      ? await policyPriorityService.getStateSkillPriorities(stateCode)
      : await policyPriorityService.getNationalSkillPriorities();

    return NextResponse.json({ success: true, count: priorities.length, data: priorities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
