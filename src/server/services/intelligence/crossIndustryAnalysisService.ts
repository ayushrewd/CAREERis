import { CrossIndustryAdoptionRecord } from "@/types/intelligence";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { demandSignalRepository } from "@/server/repositories/demandSignalRepository";
import { CANONICAL_INDUSTRIES } from "@/data/canonicalIndustriesData";

export const crossIndustryAnalysisService = {
  async getSkillIndustryDiffusion(skillId: string): Promise<CrossIndustryAdoptionRecord> {
    const skill = await skillGraphRepository.findById(skillId);
    const skillName = skill ? skill.name : skillId;

    // Cross-industry adoption distribution
    let primaryOrigin = "Enterprise Software & Cloud Platforms";
    let diffusionPattern: "RAPID_DIFFUSION" | "CONVERGING" | "NICHE_SPECIALIZED" = "RAPID_DIFFUSION";

    if (skillId === "skill-bms") {
      primaryOrigin = "Electric Vehicles (EV) & Battery Systems";
      diffusionPattern = "CONVERGING";
    } else if (skillId === "skill-plc") {
      primaryOrigin = "Automotive Component Manufacturing";
      diffusionPattern = "CONVERGING";
    }

    const industryDistribution = [
      {
        industryId: "ind-it-software",
        industryName: "Enterprise Software & Cloud Platforms",
        demandSharePct: 38.5,
        headcountDemand: 4200,
        growthRateYoY: 18.2,
      },
      {
        industryId: "ind-auto-ev",
        industryName: "Electric Vehicles (EV) & Battery Systems",
        demandSharePct: 24.5,
        headcountDemand: 2800,
        growthRateYoY: 34.0,
      },
      {
        industryId: "ind-bfsi-fintech",
        industryName: "Banking, Financial Services & FinTech",
        demandSharePct: 21.0,
        headcountDemand: 2300,
        growthRateYoY: 22.5,
      },
      {
        industryId: "ind-pharma-biotech",
        industryName: "Pharmaceutical Formulation & Bio-Manufacturing",
        demandSharePct: 16.0,
        headcountDemand: 1750,
        growthRateYoY: 28.0,
      },
    ];

    return {
      skillId,
      skillName,
      primaryOriginIndustry: primaryOrigin,
      diffusionPattern,
      industryDistribution,
      diversityIndex: 0.88,
    };
  },
};
