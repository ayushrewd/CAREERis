import { NextRequest } from "next/server";
import { CANONICAL_INDUSTRIES } from "@/data/canonicalIndustriesData";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get("sector") || undefined;

    let list = [...CANONICAL_INDUSTRIES];
    if (sector) {
      list = list.filter((i) => i.sector.toLowerCase() === sector.toLowerCase());
    }

    return successResponse(list);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch industries", "INDUSTRY_ERROR", 500);
  }
}
