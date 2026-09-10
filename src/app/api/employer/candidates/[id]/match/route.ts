import { NextRequest, NextResponse } from "next/server";
import { candidateDiscoveryService } from "@/server/services/employer/candidateDiscoveryService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const requisitionId = searchParams.get("requisitionId") || "req-tm-bms-01";

    const dossier = await candidateDiscoveryService.getCandidateMatchDossier(params.id, requisitionId);
    if (!dossier) {
      return NextResponse.json({ success: false, error: "Candidate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: dossier });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
