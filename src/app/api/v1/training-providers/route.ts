import { NextRequest, NextResponse } from "next/server";
import { reskillingAndTrainingService } from "@/server/services/employer/reskillingAndTrainingService";

export async function GET(req: NextRequest) {
  try {
    const providers = await reskillingAndTrainingService.getTrainingPartners();
    return NextResponse.json({ success: true, count: providers.length, data: providers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
