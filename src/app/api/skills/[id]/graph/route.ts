import { NextRequest } from "next/server";
import { skillGraphService } from "@/server/services/skill/skillGraphService";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const graphData = await skillGraphService.getSkillGraph(params.id);
    return successResponse(graphData);
  } catch (err: any) {
    if (err?.message?.includes("not found")) {
      return notFoundResponse(`Skill ${params.id} not found`);
    }
    return errorResponse(err?.message || "Failed to generate skill graph", "GRAPH_ERROR", 500);
  }
}
