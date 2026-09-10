import { Company } from "@/types";
import { DEMO_COMPANIES } from "@/data/demoData";

let inMemoryCompanies: Company[] = [...DEMO_COMPANIES];

export interface PlacementFeedbackRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  jobRole: string;
  hiredAt: string;
  performanceScore: number;
  observedGaps: string[];
  feedbackText: string;
  submittedAt: string;
}

export interface DemandSignalRecord {
  id: string;
  companyId: string;
  companyName: string;
  sector: string;
  jobRole: string;
  district: string;
  state: string;
  headcountDemand: number;
  targetQuarter: string;
  criticalSkills: string[];
  submittedAt: string;
}

let inMemoryFeedback: PlacementFeedbackRecord[] = [];
let inMemoryDemand: DemandSignalRecord[] = [
  {
    id: "dem-tata-01",
    companyId: "comp-tata-motors",
    companyName: "Tata Motors EV",
    sector: "Automotive & Clean Tech",
    jobRole: "High-Voltage BMS Specialist",
    district: "Pune",
    state: "Maharashtra",
    headcountDemand: 150,
    targetQuarter: "Q2 2026",
    criticalSkills: ["Battery Management Systems (BMS)", "CAN Protocol", "Thermal Validation"],
    submittedAt: new Date().toISOString(),
  },
];

export const employerRepository = {
  async findAll(): Promise<Company[]> {
    return [...inMemoryCompanies];
  },

  async findById(id: string): Promise<Company | null> {
    const comp = inMemoryCompanies.find((c) => c.id === id);
    return comp || null;
  },

  async saveFeedback(data: Omit<PlacementFeedbackRecord, "id" | "submittedAt">): Promise<PlacementFeedbackRecord> {
    const rec: PlacementFeedbackRecord = {
      ...data,
      id: `fb-${Date.now().toString(36)}`,
      submittedAt: new Date().toISOString(),
    };
    inMemoryFeedback = [rec, ...inMemoryFeedback];
    return rec;
  },

  async getFeedback(): Promise<PlacementFeedbackRecord[]> {
    return [...inMemoryFeedback];
  },

  async saveDemandSignal(data: Omit<DemandSignalRecord, "id" | "submittedAt">): Promise<DemandSignalRecord> {
    const rec: DemandSignalRecord = {
      ...data,
      id: `ds-${Date.now().toString(36)}`,
      submittedAt: new Date().toISOString(),
    };
    inMemoryDemand = [rec, ...inMemoryDemand];
    return rec;
  },

  async getDemandSignals(): Promise<DemandSignalRecord[]> {
    return [...inMemoryDemand];
  },

  async findDemandSignals(params?: { district?: string; skillId?: string }): Promise<DemandSignalRecord[]> {
    let items = [...inMemoryDemand];
    if (params?.district) {
      items = items.filter((d) => d.district.toLowerCase() === params.district!.toLowerCase());
    }
    return items;
  },
};
