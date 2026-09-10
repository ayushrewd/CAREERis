import {
  DistrictSkillAndTrainingProfile,
  DistrictActionRecommendation,
} from "@/types/decisionIntelligence";
import { geographyRepository } from "@/server/repositories/geographyRepository";
import { demandAggregationService } from "@/server/services/intelligence/demandAggregationService";
import { labourMarketGapService } from "@/server/services/intelligence/labourMarketGapService";
import { trainerCapacityService } from "./trainerCapacityService";
import { equipmentCapacityService } from "./equipmentCapacityService";
import { courseHealthService } from "./courseHealthService";

export const districtActionService = {
  async generateDistrictProfile(districtId: string): Promise<DistrictSkillAndTrainingProfile> {
    const district = await geographyRepository.findDistrictById(districtId);
    const districtName = district ? district.name : districtId;
    const stateCode = district ? district.stateId.replace("state-", "").toUpperCase() : "MH";

    const demandSummary = await demandAggregationService.aggregateDemand({ districtId });
    const gaps = await labourMarketGapService.getAllRegionalGaps({ districtId });
    const trainerGaps = await trainerCapacityService.getAllTrainerGaps(districtName);
    const equipmentGaps = await equipmentCapacityService.getAllEquipmentGaps(districtName);
    const courseHealths = await courseHealthService.evaluateAllCourses();

    const healthyCount = courseHealths.filter((c) => c.classification === "HEALTHY" || c.classification === "EXCELLENT").length;
    const watchCount = courseHealths.filter((c) => c.classification === "WATCH").length;
    const atRiskCount = courseHealths.filter((c) => c.classification === "AT_RISK" || c.classification === "CRITICAL").length;

    const recommendations: DistrictActionRecommendation[] = [];

    // Rule 1: High Deficit Skill -> Recommend Seat Expansion
    if (gaps.length > 0 && gaps[0].netGap > 500) {
      recommendations.push({
        id: `act-rec-${districtId}-seat-expand`,
        districtId,
        districtName,
        actionType: "EXPAND_SEATS",
        priority: "CRITICAL",
        title: `Sanctioned Seating Expansion: ${gaps[0].skillName}`,
        description: `Annual employer hiring demand (${gaps[0].annualEmployerDemand} units) significantly exceeds local available supply (${gaps[0].availableVerifiedSupply} units). Expand batch seating by 2x.`,
        expectedImpact: "Increase annual verified graduate output by 35-50 candidates within 6 months.",
        affectedPopulation: 120,
        affectedSkills: [gaps[0].skillId],
        affectedCourses: ["course-bms-01"],
        confidence: 0.96,
        evidence: [
          `Triangulated hiring deficit: ${gaps[0].netGap} units`,
          `Market Tightness Index: ${gaps[0].marketTightness}`,
        ],
        estimatedImplementationComplexity: "MEDIUM",
      });
    }

    // Rule 2: Trainer Gap -> Recommend Faculty Retraining
    if (trainerGaps.length > 0 && trainerGaps[0].netGap > 0) {
      recommendations.push({
        id: `act-rec-${districtId}-trainer-retrain`,
        districtId,
        districtName,
        actionType: "RETRAIN_TRAINERS",
        priority: "HIGH",
        title: `Faculty Development & Certification: ${trainerGaps[0].skillName}`,
        description: trainerGaps[0].retrainingRecommendation,
        expectedImpact: `Equip ${trainerGaps[0].netGap} master instructors to deliver hands-on practical lab modules.`,
        affectedPopulation: trainerGaps[0].netGap,
        affectedSkills: [trainerGaps[0].skillId],
        affectedCourses: ["course-bms-01", "course-ros-01"],
        confidence: 0.94,
        evidence: [
          `Available certified trainers: ${trainerGaps[0].availableTrainers}`,
          `Required trainers for sanctioned intake: ${trainerGaps[0].requiredTrainers}`,
        ],
        estimatedImplementationComplexity: "LOW",
      });
    }

    // Rule 3: Course Obsolescence / At-Risk -> Recommend Curriculum Modernization
    if (atRiskCount > 0) {
      recommendations.push({
        id: `act-rec-${districtId}-curriculum-modernize`,
        districtId,
        districtName,
        actionType: "REVISE_CURRICULUM",
        priority: "HIGH",
        title: "Curriculum Modernization: Manual Drafting Trade",
        description: "Modernize legacy manual drafting course syllabus with 3D Parametric CAD (SolidWorks) and CNC CAM toolpathing.",
        expectedImpact: "Restore graduate placement rates from 28% to benchmark > 80%.",
        affectedPopulation: 35,
        affectedSkills: ["skill-cad", "skill-cnc"],
        affectedCourses: ["course-legacy-draft-01"],
        confidence: 0.98,
        evidence: [
          "Curriculum age > 7 years",
          "Placement audit showing under 30% employment conversion",
        ],
        estimatedImplementationComplexity: "MEDIUM",
      });
    }

    return {
      districtId,
      districtName,
      stateCode,
      period: "2026-Q2",
      summaryMetrics: {
        totalDemand: demandSummary.totalDemandVolume,
        availableSupply: 1100,
        trainingCapacitySeats: 120,
        overallNetGap: gaps.reduce((sum, g) => sum + g.netGap, 0),
        averagePlacementRate: 82.4,
        trainerShortageCount: trainerGaps.reduce((sum, t) => sum + t.netGap, 0),
        equipmentShortageCount: equipmentGaps.reduce((sum, e) => sum + e.netGap, 0),
      },
      prioritySkills: gaps.slice(0, 6).map((g) => ({
        skillId: g.skillId,
        skillName: g.skillName,
        demand: g.annualEmployerDemand,
        netGap: g.netGap,
        tightness: g.marketTightness,
      })),
      courseHealthBreakdown: {
        healthy: healthyCount,
        watch: watchCount,
        atRisk: atRiskCount,
      },
      recommendations,
      confidence: 0.95,
    };
  },
};
