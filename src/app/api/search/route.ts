import { NextRequest } from "next/server";
import { searchService } from "@/server/services/searchService";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";
import { resolveOptionalAuthContext } from "@/server/middleware/authContext";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const auth = resolveOptionalAuthContext(request);
    const results = await searchService.globalSearch(q, auth?.userId);
    return successResponse(results);
  } catch (err: any) {
    const message = err?.message || "Search failed";
    return errorResponse(message, "SEARCH_ERROR", 500);
  }
}
