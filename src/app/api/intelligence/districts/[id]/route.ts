import { NextRequest } from "next/server";
import { geographyRepository } from "@/server/repositories/geographyRepository";
import { demandAggregationService } from "@/server/services/intelligence/demandAggregationService";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { curriculumAlignmentService } from "@/server/services/intelligence/curriculumAlignmentService";
import { successResponse, notFoundResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const district = await geographyRepository.findDistrictById(params.id);
    if (!district) {
      return notFoundResponse(`District ${params.id} not found`);
    }

    const demandSummary = await demandAggregationService.aggregateDemand({ districtId: district.id });
    const gaps = await labourMarketGapService.getAllRegionalGaps({ districtId: district.id });
    const curriculumAlignments = await curriculumAlignmentService.getCurriculumAlignments(district.name);

    return successResponse({
      district,
      demandSummary,
      skillGaps: gaps.slice(0, 8),
      curriculumAlignments,
      confidence: 0.94,
    });
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch district intelligence", "DISTRICT_ERROR", 500);
  }
}
