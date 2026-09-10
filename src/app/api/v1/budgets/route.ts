import { NextRequest, NextResponse } from "next/server";
import { programmeBudgetService } from "@/server/services/programme/programmeBudgetService";

export async function GET(req: NextRequest) {
  try {
    const budgets = await programmeBudgetService.getAllBudgets();
    const summary = await programmeBudgetService.getBudgetSummary();

    return NextResponse.json({
      success: true,
      data: {
        summary,
        budgets,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
