import { TrainingAccessGap } from "@/types/decisionIntelligence";
import { geographyRepository } from "@/server/repositories/geographyRepository";

export const trainingAccessGapService = {
  async evaluateDistrictAccess(districtId: string, skillId = "skill-bms"): Promise<TrainingAccessGap> {
    const district = await geographyRepository.findDistrictById(districtId);
    const districtName = district ? district.name : districtId;
    const stateCode = district ? district.stateId.replace("state-", "").toUpperCase() : "MH";

    // Pilot evaluation: Rural/peri-urban districts vs Tech Hubs
    const isRural = districtName.toLowerCase().includes("gadchiroli") || districtName.toLowerCase().includes("washim") || districtName.toLowerCase().includes("nandurbar");
    const isMajorHub = districtName.toLowerCase().includes("pune") || districtName.toLowerCase().includes("bengaluru") || districtName.toLowerCase().includes("chennai");

    const nearestTrainingCenterKm = isMajorHub ? 8 : (isRural ? 85 : 32);
    const localCapacityUnits = isMajorHub ? 35 : (isRural ? 0 : 15);
    const localEmployerDemand = isMajorHub ? 1850 : (isRural ? 120 : 450);

    let accessSeverity: TrainingAccessGap["accessSeverity"] = "ADEQUATE_ACCESS";
    let deliveryModeRecommendation: TrainingAccessGap["deliveryModeRecommendation"] = "NEW_ITI_COE_WING";

    if (localCapacityUnits === 0 && localEmployerDemand > 50) {
      accessSeverity = "CRITICAL_DESERT";
      deliveryModeRecommendation = "MOBILE_TRAINING_UNIT";
    } else if (nearestTrainingCenterKm > 25) {
      accessSeverity = "MODERATE_GAP";
      deliveryModeRecommendation = "SATELLITE_LAB_EXTENSION";
    } else {
      deliveryModeRecommendation = "NEW_ITI_COE_WING";
    }

    return {
      districtId,
      districtName,
      stateCode,
      demandedSkillId: skillId,
      demandedSkillName: skillId === "skill-bms" ? "Battery Management Systems (BMS)" : "PLC Automation & SCADA",
      localEmployerDemand,
      localTrainingCapacity: localCapacityUnits,
      nearestTrainingCenterKm,
      accessSeverity,
      deliveryModeRecommendation,
      confidence: 0.95,
    };
  },

  async getAllAccessGaps(stateCode = "MH"): Promise<TrainingAccessGap[]> {
    const districts = await geographyRepository.findDistrictsByState(stateCode);
    const results: TrainingAccessGap[] = [];
    for (const d of districts) {
      const gap = await this.evaluateDistrictAccess(d.id);
      results.push(gap);
    }
    return results;
  },
};
