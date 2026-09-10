import { NextRequest, NextResponse } from "next/server";
import { evidenceFusionService } from "@/server/services/intelligence/decision/evidenceFusionService";

export async function GET(req: NextRequest) {
  try {
    const skillId = req.nextUrl.searchParams.get("skillId");
    const stateCode = req.nextUrl.searchParams.get("stateCode") || "MH";

    if (skillId) {
      const fused = await evidenceFusionService.fuseEvidenceForSkill(skillId, stateCode);
      return NextResponse.json({ success: true, data: fused });
    }

    const all = await evidenceFusionService.getAllEvidence();
    return NextResponse.json({ success: true, data: all, total: all.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
