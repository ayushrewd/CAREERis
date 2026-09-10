import { NextRequest, NextResponse } from "next/server";
import { trainerIntelligenceService } from "@/server/services/training/trainerIntelligenceService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const instituteId = searchParams.get("instituteId") || undefined;
    const qualificationStatus = searchParams.get("qualificationStatus") || undefined;

    const trainers = await trainerIntelligenceService.getAllTrainers({ instituteId, qualificationStatus });
    return NextResponse.json({ success: true, count: trainers.length, data: trainers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
