import { NextRequest, NextResponse } from "next/server";
import { stateIntelligenceService } from "@/server/services/government/stateIntelligenceService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dossier = await stateIntelligenceService.getStateFullDossier(params.id);
    if (!dossier) {
      return NextResponse.json({ success: false, error: "State not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: dossier });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
