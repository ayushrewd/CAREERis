import { NextRequest, NextResponse } from "next/server";
import { programmeBudgetService } from "@/server/services/programme/programmeBudgetService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const budget = await programmeBudgetService.getBudgetByProgrammeId(params.id);
    if (!budget) {
      return NextResponse.json({ success: false, error: "Budget record not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: budget });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
