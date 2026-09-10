import { NextRequest, NextResponse } from "next/server";
import { trainingFunnelService } from "@/server/services/training/trainingFunnelService";

export async function GET(req: NextRequest) {
  try {
    const [stages, dropOff] = await Promise.all([
      trainingFunnelService.getFunnelStages(),
      trainingFunnelService.getDropOffAnalysis(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stages,
        dropOffAnalysis: dropOff,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
