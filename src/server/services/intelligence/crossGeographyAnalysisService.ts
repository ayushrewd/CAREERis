import { CrossGeographyAdoptionRecord } from "@/types/intelligence";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { demandSignalRepository } from "@/server/repositories/demandSignalRepository";

export const crossGeographyAnalysisService = {
  async getSkillGeographicDistribution(skillId: string): Promise<CrossGeographyAdoptionRecord> {
    const skill = await skillGraphRepository.findById(skillId);
    const skillName = skill ? skill.name : skillId;

    const topStates = [
      { stateCode: "MH", stateName: "Maharashtra", demand: 5800, sharePct: 34.0 },
      { stateCode: "KA", stateName: "Karnataka", demand: 4200, sharePct: 24.5 },
      { stateCode: "TN", stateName: "Tamil Nadu", demand: 3100, sharePct: 18.0 },
      { stateCode: "GJ", stateName: "Gujarat", demand: 2200, sharePct: 13.0 },
      { stateCode: "TS", stateName: "Telangana", demand: 1800, sharePct: 10.5 },
    ];

    const topDistricts = [
      { districtId: "dist-mh-pun", districtName: "Pune", demand: 3200, netGap: 1850 },
      { districtId: "dist-ka-blr", districtName: "Bengaluru Urban", demand: 2800, netGap: 1400 },
      { districtId: "dist-tn-che", districtName: "Chennai", demand: 1950, netGap: 980 },
      { districtId: "dist-gj-ahd", districtName: "Ahmedabad", demand: 1450, netGap: 720 },
      { districtId: "dist-up-gbn", districtName: "Gautam Buddha Nagar (Noida)", demand: 1350, netGap: 690 },
    ];

    const topClusters = [
      { clusterId: "cl-pun-chakan", clusterName: "Chakan Automotive & EV Hub (Pune)", demand: 2100 },
      { clusterId: "cl-blr-ecity", clusterName: "Electronics City & Whitefield AI Hub", demand: 1850 },
      { clusterId: "cl-che-oragadam", clusterName: "Oragadam - Sriperumbudur Auto Cluster", demand: 1400 },
      { clusterId: "cl-gj-sanand", clusterName: "Sanand EV & Semiconductor Corridor", demand: 1100 },
    ];

    const fastestGrowingDistricts = [
      { districtName: "Pune", growthRateYoY: 34.5 },
      { districtName: "Ahmedabad", growthRateYoY: 38.0 },
      { districtName: "Bengaluru Urban", growthRateYoY: 42.0 },
      { districtName: "Chennai", growthRateYoY: 31.0 },
      { districtName: "Gautam Buddha Nagar (Noida)", growthRateYoY: 29.5 },
    ];

    const nationalDemandTotal = topStates.reduce((sum, s) => sum + s.demand, 0);

    return {
      skillId,
      skillName,
      nationalDemandTotal,
      topStates,
      topDistricts,
      topClusters,
      fastestGrowingDistricts,
    };
  },
};
