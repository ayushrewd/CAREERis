import { NextRequest, NextResponse } from "next/server";
import { beneficiaryAndOutcomeService } from "@/server/services/programme/beneficiaryAndOutcomeService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const funnel = await beneficiaryAndOutcomeService.getBeneficiaryFunnel(params.id);
    if (!funnel) {
      return NextResponse.json({ success: false, error: "Outcomes not found for programme" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: funnel });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
