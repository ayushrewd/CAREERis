import { NextRequest, NextResponse } from "next/server";
import { systemHealthService } from "@/server/services/security/systemHealthService";

export async function GET(req: NextRequest) {
  try {
    const services = await systemHealthService.getSystemHealth();
    const summary = await systemHealthService.getOverallSystemStatus();

    return NextResponse.json({
      success: true,
      data: {
        summary,
        services,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
