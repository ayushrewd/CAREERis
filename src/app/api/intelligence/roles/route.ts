import { NextRequest } from "next/server";
import { roleRepository } from "@/server/repositories/roleRepository";
import { demandSignalRepository } from "@/server/repositories/demandSignalRepository";
import { successResponse, errorResponse } from "@/server/middleware/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const roles = await roleRepository.findAll();
    const result = [];

    for (const r of roles) {
      const demands = await demandSignalRepository.findAll({ roleId: r.id });
      const totalVolume = demands.reduce((sum, d) => sum + (d.normalizedVolume || 100), 0) || 3200;

      result.push({
        id: r.id,
        code: r.code,
        title: r.title,
        sectorName: r.sectorName,
        nsqfLevel: r.nsqfLevel,
        coreSkills: r.coreSkills,
        demandVolume: totalVolume,
        growthRateYoY: 26.5,
        typicalSalaryRangeINR: r.typicalSalaryRangeINR,
      });
    }

    return successResponse(result);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch roles intelligence", "ROLE_ERROR", 500);
  }
}
