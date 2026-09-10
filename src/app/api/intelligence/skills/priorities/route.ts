import { NextRequest, NextResponse } from "next/server";
import { skillPriorityService } from "@/server/services/intelligence/decision/skillPriorityService";

export async function GET(req: NextRequest) {
  try {
    const skillId = req.nextUrl.searchParams.get("skillId");
    if (skillId) {
      const priority = await skillPriorityService.evaluateSkillPriority(skillId);
      return NextResponse.json({ success: true, data: priority });
    }

    const all = await skillPriorityService.getAllPriorities();
    return NextResponse.json({ success: true, data: all, total: all.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
