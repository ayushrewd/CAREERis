import { NextRequest } from "next/server";
import { geographyRepository } from "@/server/repositories/geographyRepository";
import { demandAggregationService } from "@/server/services/intelligence/demandAggregationService";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clusters = await geographyRepository.findAllClusters();
    const cluster = clusters.find(
      (c) => c.id.toLowerCase() === params.id.toLowerCase() || c.code.toLowerCase() === params.id.toLowerCase()
    );

    if (!cluster) {
      return notFoundResponse(`Cluster ${params.id} not found`);
    }

    const demandSummary = await demandAggregationService.aggregateDemand({ districtId: cluster.districtId });

    return successResponse({
      cluster,
      demandSummary,
      confidence: 0.95,
    });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch cluster intelligence", "CLUSTER_ERROR", 500);
  }
}
