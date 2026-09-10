import { MarketTightness } from "@/types/intelligence";
import { labourMarketGapService } from "./labourMarketGapService";

export interface MarketTightnessSummary {
  skillId: string;
  skillName: string;
  tightness: MarketTightness;
  demandSupplyRatio: number;
  description: string;
  actionGuidance: string;
}

export const marketTightnessService = {
  async evaluateTightness(skillId: string, geography?: { stateCode?: string; districtId?: string }): Promise<MarketTightnessSummary> {
    const gap = await labourMarketGapService.calculateSkillGap(skillId, geography);

    let description = "";
    let actionGuidance = "";

    switch (gap.marketTightness) {
      case "VERY_TIGHT":
        description = "Severe hiring deficit. Employers face high time-to-hire (> 60 days) and talent poaching.";
        actionGuidance = "State Government & DTE should fast-track CoE vocational seating expansion and apprenticeship subsidies.";
        break;
      case "TIGHT":
        description = "Moderate talent shortage. Available candidate supply meets ~50-70% of current employer requisitions.";
        actionGuidance = "Training providers should expand modular batch timings and partner with local industry clusters.";
        break;
      case "BALANCED":
        description = "Equilibrium. Active job requisitions align well with annual ITI/polytechnic graduate outputs.";
        actionGuidance = "Maintain steady curriculum quality and ensure timely certification renewals.";
        break;
      case "SURPLUS":
        description = "Supply exceeds current localized hiring demand.";
        actionGuidance = "Promote inter-district mobility linkages and upskilling into emerging adjacencies.";
        break;
      default:
        description = "Insufficient statistical sample to establish high-confidence tightness index.";
        actionGuidance = "Encourage local industry council survey participation to enrich baseline signals.";
    }

    return {
      skillId,
      skillName: gap.skillName,
      tightness: gap.marketTightness,
      demandSupplyRatio: gap.gapRatio,
      description,
      actionGuidance,
    };
  },
};
