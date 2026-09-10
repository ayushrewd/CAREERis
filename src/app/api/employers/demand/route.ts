import { NextRequest } from "next/server";
import { employerService } from "@/server/services/employerService";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET() {
  try {
    const list = await employerService.getDemandSignals();
    return successResponse(list);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch demand signals", "FETCH_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    if (!body.companyName || !body.jobRole || !body.headcountDemand) {
      return errorResponse("companyName, jobRole and headcountDemand are required", "VALIDATION_ERROR", 400);
    }

    const ds = await employerService.submitDemandSignal({
      data: {
        companyId: body.companyId || "comp-custom",
        companyName: body.companyName,
        sector: body.sector || "Automotive & Manufacturing",
        jobRole: body.jobRole,
        district: body.district || "Pune",
        state: body.state || "Maharashtra",
        headcountDemand: parseInt(body.headcountDemand, 10),
        targetQuarter: body.targetQuarter || "Q3 2026",
        criticalSkills: body.criticalSkills || [],
      },
      auth,
    });

    return successResponse(ds, undefined, 201);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to submit demand signal", "SUBMIT_ERROR", 500);
  }
}
