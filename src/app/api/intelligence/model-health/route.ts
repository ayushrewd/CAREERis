import { NextRequest, NextResponse } from "next/server";
import { modelRegistryService } from "@/server/services/intelligence/modelRegistryService";

export async function GET(req: NextRequest) {
  try {
    const health = await modelRegistryService.getModelHealthScorecard();
    return NextResponse.json({ success: true, data: health });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
