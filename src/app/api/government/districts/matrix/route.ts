import { NextRequest, NextResponse } from "next/server";
import { districtMatrixService } from "@/server/services/government/districtMatrixService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get("stateCode") || undefined;
    const skillId = searchParams.get("skillId") || undefined;
    const priorityCategory = searchParams.get("priorityCategory") || undefined;

    const matrix = await districtMatrixService.getDistrictSkillMatrix({ stateCode, skillId, priorityCategory });
    return NextResponse.json({ success: true, count: matrix.length, data: matrix });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
