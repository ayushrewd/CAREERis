// ==============================================================================
// CAREERIS CLUSTER & MOBILITY SERVICE
// Industrial Cluster Intelligence, Skill Transferability & Policy Mobility
// ==============================================================================

export interface IndustrialClusterDetail {
  clusterId: string;
  clusterName: string;
  stateCode: string;
  districtName: string;
  primaryIndustry: string;
  anchorEmployers: string[];
  totalWorkforceEstimate: number;
  criticalSkillsNeeded: string[];
  activeTrainingCentersCount: number;
}

const CANONICAL_CLUSTERS: IndustrialClusterDetail[] = [
  {
    clusterId: "cluster-chakan",
    clusterName: "Chakan-Talegaon Industrial Corridor",
    stateCode: "MH",
    districtName: "Pune",
    primaryIndustry: "Automotive & Electric Mobility",
    anchorEmployers: ["Tata Motors EV", "Bajaj Auto", "Mahindra & Mahindra", "Bharat Forge"],
    totalWorkforceEstimate: 145000,
    criticalSkillsNeeded: ["Battery Management Systems (BMS)", "5-Axis CNC Machining", "High-Voltage Safety Norms"],
    activeTrainingCentersCount: 14,
  },
  {
    clusterId: "cluster-peenya",
    clusterName: "Peenya Industrial Area",
    stateCode: "KA",
    districtName: "Bengaluru Urban",
    primaryIndustry: "Industrial Automation & Electronics",
    anchorEmployers: ["ABB India", "Schneider Electric", "Bosch", "Dynamatic Tech"],
    totalWorkforceEstimate: 110000,
    criticalSkillsNeeded: ["Edge AI & Embedded Firmware", "PLC Automation & SCADA", "Vector CANoe Diagnostics"],
    activeTrainingCentersCount: 12,
  },
  {
    clusterId: "cluster-oragadam",
    clusterName: "Oragadam-Sriperumbudur Auto Hub",
    stateCode: "TN",
    districtName: "Chennai",
    primaryIndustry: "Automotive & Heavy Manufacturing",
    anchorEmployers: ["Hyundai Motor India", "Renault-Nissan", "Daimler Commercial", "Apollo Tyres"],
    totalWorkforceEstimate: 135000,
    criticalSkillsNeeded: ["Robotic Cell Spot Welding", "Automotive Quality Assurance", "CNC Tooling"],
    activeTrainingCentersCount: 16,
  },
  {
    clusterId: "cluster-sanand",
    clusterName: "Sanand Auto & Engineering Corridor",
    stateCode: "GJ",
    districtName: "Ahmedabad",
    primaryIndustry: "Automotive & Precision Engineering",
    anchorEmployers: ["Tata Motors", "Maruti Suzuki", "Minda Corporation"],
    totalWorkforceEstimate: 95000,
    criticalSkillsNeeded: ["5-Axis CNC Precision Machining", "Press Tool Design", "Industrial Robotics"],
    activeTrainingCentersCount: 8,
  },
  {
    clusterId: "cluster-noida-sec62",
    clusterName: "Noida Electronics & Hardware Zone",
    stateCode: "UP",
    districtName: "Gautam Buddha Nagar",
    primaryIndustry: "Electronics System Design & Manufacturing (ESDM)",
    anchorEmployers: ["Dixon Technologies", "Samsung Electronics", "Lava International"],
    totalWorkforceEstimate: 85000,
    criticalSkillsNeeded: ["Surface Mount Technology (SMT)", "IPC-A-610 Soldering Standards", "SMT AOI Inspection"],
    activeTrainingCentersCount: 9,
  },
];

export const clusterAndMobilityService = {
  async getIndustrialClusters(params?: { stateCode?: string }): Promise<IndustrialClusterDetail[]> {
    let list = [...CANONICAL_CLUSTERS];
    if (params?.stateCode) {
      list = list.filter((c) => c.stateCode.toLowerCase() === params.stateCode!.toLowerCase());
    }
    return list;
  },

  async getCrossIndustryTransferability() {
    return {
      transferableSkillGroups: [
        {
          canonicalSkill: "PLC Automation & SCADA",
          originIndustry: "Traditional Heavy Manufacturing",
          destinationIndustries: ["Automotive & EV", "Biopharma Process Plants", "Renewable Energy Substations"],
          transferabilityIndex: 94,
          bridgeTrainingWeeks: 2,
          notes: "Core ladder logic and Modbus/Profibus telemetry translates directly across manufacturing domains.",
        },
        {
          canonicalSkill: "CAN Bus Communication",
          originIndustry: "Automotive Diagnostics",
          destinationIndustries: ["EV Powertrains", "Off-Highway Heavy Machinery", "Aerospace Test Benches"],
          transferabilityIndex: 91,
          bridgeTrainingWeeks: 3,
          notes: "CAN DBC frame parsing and ECU troubleshooting share universal physical and data-link layers.",
        },
        {
          canonicalSkill: "5-Axis CNC Machining",
          originIndustry: "Automotive Tool & Die",
          destinationIndustries: ["Aerospace Turbine Components", "Orthopedic Medical Implants", "Semiconductor Tooling"],
          transferabilityIndex: 88,
          bridgeTrainingWeeks: 4,
          notes: "Requires transition from tool steel machining to titanium/Inconel precision tolerances.",
        },
      ],
    };
  },

  async getPolicyMobilityIntelligence() {
    return {
      corridorMobilityRecommendations: [
        {
          originDistrict: "Kolhapur (Surplus Conventional Foundry & Machinist Talent)",
          destinationDistrict: "Pune / Chakan (Severe 5-Axis CNC Deficit)",
          potentialCandidatePool: 1200,
          mobilitySupportPolicy: "Provide 30-day subsidized transit hostel and modular CNC transition stipend under MSSDS.",
        },
        {
          originDistrict: "Tiruchirappalli (Surplus Manual Welder Trade Output)",
          destinationDistrict: "Chennai / Oragadam (Robotic Welding Shortage)",
          potentialCandidatePool: 850,
          mobilitySupportPolicy: "Deploy mobile robotic simulator van for 40-hour pre-mobility upskilling.",
        },
      ],
    };
  },
};
