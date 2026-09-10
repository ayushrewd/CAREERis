import { NextRequest, NextResponse } from "next/server";
import { trainerIntelligenceService } from "@/server/services/training/trainerIntelligenceService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pathway = await trainerIntelligenceService.generateRetrainingPathway(params.id);
    if (!pathway) {
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: pathway });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
