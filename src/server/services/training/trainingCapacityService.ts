// ==============================================================================
// CAREERIS TRAINING CAPACITY & SEAT PLANNING SERVICE
// Pan-India Capacity Mapping & Capacity Scenarios (+10%, +25%, +50%, Custom)
// ==============================================================================

export interface CapacityScenarioResult {
  label: "SIMULATION";
  scenarioName: string;
  baselineSeats: number;
  projectedSeats: number;
  projectedGraduateOutput: number;
  projectedPlacements: number;
  additionalTrainersRequired: number;
  additionalLabCostINR: number;
  confidence: number;
}

export const trainingCapacityService = {
  async getCapacityOverview(params?: { stateCode?: string; districtId?: string }) {
    return {
      scope: params?.districtId ? `District (${params.districtId})` : params?.stateCode ? `State (${params.stateCode})` : "Pan-India National",
      totalSanctionedSeats: 1850000,
      totalActiveEnrolled: 1420000,
      averageSeatUtilizationPercentage: 76.8,
      totalActiveTrainers: 68500,
      totalTechnicalLabs: 24500,
      averagePlacementRatePercentage: 64.2,
      criticalCapacityShortageSkills: [
        { skillName: "Battery Management Systems (BMS)", currentSeats: 12400, requiredSeats: 38000, gap: 25600 },
        { skillName: "5-Axis CNC Precision Machining", currentSeats: 32000, requiredSeats: 65000, gap: 33000 },
        { skillName: "Edge AI & Embedded Firmware", currentSeats: 14500, requiredSeats: 42000, gap: 27500 },
      ],
      isDemoData: true,
    };
  },

  async runCapacityScenario(deltaPercentage: number, targetSkillId?: string): Promise<CapacityScenarioResult> {
    const baseSeats = 1200;
    const projected = Math.round(baseSeats * (1 + deltaPercentage / 100));
    const addlSeats = projected - baseSeats;
    const addlTrainers = Math.ceil(addlSeats / 24);
    const addlCost = addlSeats * 28000;

    return {
      label: "SIMULATION",
      scenarioName: `Seat Expansion Scenario (${deltaPercentage > 0 ? "+" : ""}${deltaPercentage}%) for ${targetSkillId || "Target Trade"}`,
      baselineSeats: baseSeats,
      projectedSeats: projected,
      projectedGraduateOutput: Math.round(projected * 0.88),
      projectedPlacements: Math.round(projected * 0.88 * 0.84),
      additionalTrainersRequired: addlTrainers,
      additionalLabCostINR: addlCost,
      confidence: 0.94,
    };
  },
};
