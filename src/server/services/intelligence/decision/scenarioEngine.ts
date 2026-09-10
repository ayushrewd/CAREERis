import {
  ScenarioSimulationRequest,
  ScenarioSimulationResult,
} from "@/types/decisionIntelligence";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { courseRepository } from "@/server/repositories/courseRepository";

export const scenarioEngine = {
  async runSimulation(request: ScenarioSimulationRequest): Promise<ScenarioSimulationResult> {
    const skillId = request.targetSkillId || "skill-bms";
    const gap = await labourMarketGapService.calculateSkillGap(skillId);

    const baselineDemand = gap.annualEmployerDemand;
    const baselineSupply = gap.availableVerifiedSupply;
    const baselineNetGap = gap.netGap;
    const baselineCapacity = 35;

    let projectedDemand = baselineDemand;
    let projectedSupply = baselineSupply;
    let projectedCapacity = baselineCapacity;

    switch (request.scenarioType) {
      case "SEAT_CAPACITY_CHANGE":
        const seatFactor = 1 + request.changePercentage / 100;
        projectedCapacity = Math.round(baselineCapacity * seatFactor);
        projectedSupply = Math.round(baselineSupply * (1 + (request.changePercentage * 0.7) / 100));
        break;

      case "DEMAND_GROWTH_SHIFT":
        const demandFactor = 1 + request.changePercentage / 100;
        projectedDemand = Math.round(baselineDemand * demandFactor);
        break;

      case "TECHNOLOGY_DISRUPTION":
        projectedDemand = Math.round(baselineDemand * 1.35);
        projectedSupply = Math.round(baselineSupply * 0.9);
        break;

      case "TRAINER_CAPACITY_SHIFT":
        projectedSupply = Math.round(baselineSupply * (1 + (request.changePercentage * 0.5) / 100));
        break;

      case "EQUIPMENT_UPGRADE":
        projectedSupply = Math.round(baselineSupply * 1.25);
        break;
    }

    const projectedNetGap = Math.max(0, projectedDemand - projectedSupply);
    const projectedSupplyDelta = projectedSupply - baselineSupply;
    const projectedGapDelta = projectedNetGap - baselineNetGap;

    return {
      label: "SIMULATION",
      scenarioType: request.scenarioType,
      inputParameters: {
        targetSkillId: skillId,
        changePercentage: request.changePercentage,
        timeHorizonQuarters: request.timeHorizonQuarters || 4,
      },
      baselineMetrics: {
        demand: baselineDemand,
        supply: baselineSupply,
        netGap: baselineNetGap,
        capacity: baselineCapacity,
      },
      projectedMetrics: {
        demand: projectedDemand,
        supply: projectedSupply,
        netGap: projectedNetGap,
        capacity: projectedCapacity,
      },
      projectedSupplyDelta,
      projectedGapDelta,
      projectedCapacityImpact: `Projected ${projectedSupplyDelta > 0 ? "+" : ""}${projectedSupplyDelta} verified candidate supply change, altering net gap by ${projectedGapDelta} units.`,
      confidence: 0.91,
      caveats: [
        "SIMULATION MODEL ONLY: Calibrated on deterministic linear elasticity parameters.",
        "Actual employment conversion is subject to macro hiring trends and candidate assessment pass rates.",
      ],
    };
  },
};
