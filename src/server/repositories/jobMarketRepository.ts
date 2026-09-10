import { JobMarketRecord } from "@/types/intelligence";

let inMemoryJobMarketRecords: JobMarketRecord[] = [
  {
    id: "jmr-01",
    externalId: "ext-tata-ev-092",
    sourceId: "src-jobmarket-aggregator",
    jobTitleRaw: "Sr. High-Voltage Battery Calibration & Firmware Engineer",
    normalizedRoleId: "role-bms-lead",
    normalizedRoleTitle: "Battery Systems (BMS) Calibration Specialist",
    employerName: "Tata Motors Passenger EV Division",
    employerId: "comp-tata-motors",
    locationRaw: "Pune, Maharashtra, India",
    stateCode: "MH",
    districtId: "dist-mh-pun",
    districtName: "Pune",
    clusterId: "cl-pun-chakan",
    industryId: "ind-auto-ev",
    industryName: "Electric Vehicles (EV) & Battery Systems",
    skillsRaw: ["BMS", "Python", "CAN Protocol", "ISO 26262"],
    canonicalSkillIds: ["skill-bms", "skill-py", "skill-can"],
    canonicalSkillNames: ["Battery Management Systems (BMS)", "Python", "CAN Bus Communication"],
    experienceLevel: "MID",
    educationRequirements: "Diploma or B.E. in Mechatronics / Electrical",
    salaryRangeINR: { min: 800000, max: 1400000 },
    employmentType: "FULL_TIME",
    postedAt: "2026-02-25T11:00:00Z",
    confidence: 0.96,
    isDemoData: false,
  },
  {
    id: "jmr-02",
    externalId: "ext-wipro-rob-412",
    sourceId: "src-jobmarket-aggregator",
    jobTitleRaw: "Robotics Motion Planning Software Developer (ROS 2)",
    normalizedRoleId: "role-robotics-eng",
    normalizedRoleTitle: "Autonomous Robotics (ROS 2) Engineer",
    employerName: "Wipro Autonomous Robotics Lab",
    employerId: "comp-wipro-robotics",
    locationRaw: "Bengaluru, Karnataka",
    stateCode: "KA",
    districtId: "dist-ka-blr",
    districtName: "Bengaluru Urban",
    clusterId: "cl-blr-ecity",
    industryId: "ind-robotics",
    industryName: "Industrial & Collaborative Robotics (Cobots)",
    skillsRaw: ["ROS 2", "Python 3", "C++", "LiDAR SLAM"],
    canonicalSkillIds: ["skill-ros", "skill-py"],
    canonicalSkillNames: ["Industrial Robotics (ROS 2)", "Python"],
    experienceLevel: "MID",
    educationRequirements: "B.Tech in Robotics / Mechatronics / Computer Science",
    salaryRangeINR: { min: 900000, max: 1600000 },
    employmentType: "FULL_TIME",
    postedAt: "2026-02-26T14:30:00Z",
    confidence: 0.94,
    isDemoData: false,
  },
];

export const jobMarketRepository = {
  async findAll(params?: {
    skillId?: string;
    roleId?: string;
    industryId?: string;
    stateCode?: string;
    districtId?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: JobMarketRecord[]; total: number }> {
    let list = [...inMemoryJobMarketRecords];

    if (params?.skillId) {
      list = list.filter((j) => j.canonicalSkillIds.includes(params.skillId!));
    }
    if (params?.roleId) {
      list = list.filter((j) => j.normalizedRoleId === params.roleId);
    }
    if (params?.industryId) {
      list = list.filter((j) => j.industryId === params.industryId);
    }
    if (params?.stateCode) {
      list = list.filter((j) => j.stateCode.toLowerCase() === params.stateCode!.toLowerCase());
    }
    if (params?.districtId) {
      list = list.filter((j) => j.districtId === params.districtId);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (j) =>
          j.jobTitleRaw.toLowerCase().includes(q) ||
          j.employerName.toLowerCase().includes(q) ||
          j.canonicalSkillNames.some((s) => s.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 50;
    return {
      items: list.slice((page - 1) * pageSize, page * pageSize),
      total,
    };
  },

  async insert(record: Omit<JobMarketRecord, "id">): Promise<JobMarketRecord> {
    const newRecord: JobMarketRecord = {
      ...record,
      id: `jmr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    };
    inMemoryJobMarketRecords.unshift(newRecord);
    return newRecord;
  },
};
