import { CareerGoal } from "@/types/careerJourney";

let inMemoryGoals: CareerGoal[] = [
  {
    id: "goal-rohit-01",
    candidateId: "cand-rohit-01",
    targetRoleId: "role-bms-lead",
    targetRoleTitle: "Battery Management System (BMS) Calibration Specialist",
    targetIndustryId: "ind-auto-ev",
    targetIndustryName: "Automotive & Electric Mobility",
    targetGeography: {
      stateCode: "MH",
      stateName: "Maharashtra",
      districtId: "dist-mh-pun",
      districtName: "Pune",
      clusterId: "cluster-chakan",
      clusterName: "Chakan Automotive & EV Hub",
    },
    targetSalaryRangeINR: { min: 750000, max: 1400000 },
    targetTimelineMonths: 6,
    priority: "PRIMARY",
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-02-20T10:00:00Z",
    isDemoData: false,
  },
  {
    id: "goal-rohit-02",
    candidateId: "cand-rohit-01",
    targetRoleId: "role-auto-specialist",
    targetRoleTitle: "Industry 4.0 PLC & Automation Specialist",
    targetIndustryId: "ind-ind-auto",
    targetIndustryName: "Advanced Manufacturing & Robotics",
    targetGeography: {
      stateCode: "MH",
      stateName: "Maharashtra",
      districtId: "dist-mh-pun",
      districtName: "Pune",
    },
    targetSalaryRangeINR: { min: 600000, max: 1000000 },
    targetTimelineMonths: 12,
    priority: "SECONDARY",
    createdAt: "2026-01-20T11:00:00Z",
    updatedAt: "2026-02-18T14:00:00Z",
    isDemoData: false,
  },
];

export const careerGoalRepository = {
  async findByCandidateId(candidateId: string): Promise<CareerGoal[]> {
    return inMemoryGoals.filter((g) => g.candidateId === candidateId);
  },

  async findById(id: string): Promise<CareerGoal | null> {
    const found = inMemoryGoals.find((g) => g.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async create(data: Omit<CareerGoal, "id" | "createdAt" | "updatedAt">): Promise<CareerGoal> {
    const goal: CareerGoal = {
      ...data,
      id: `goal-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryGoals.unshift(goal);
    return goal;
  },

  async update(id: string, updates: Partial<CareerGoal>): Promise<CareerGoal | null> {
    const idx = inMemoryGoals.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    inMemoryGoals[idx] = {
      ...inMemoryGoals[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryGoals[idx];
  },

  async delete(id: string): Promise<boolean> {
    const idx = inMemoryGoals.findIndex((g) => g.id === id);
    if (idx === -1) return false;
    inMemoryGoals.splice(idx, 1);
    return true;
  },
};
