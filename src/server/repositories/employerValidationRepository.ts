import {
  EmployerDemandSignal,
  LabourMarketEvidence,
} from "@/types/decisionIntelligence";
import {
  CANONICAL_EMPLOYER_SIGNALS,
  CANONICAL_LABOUR_EVIDENCE,
} from "@/data/canonicalEmployerSurveysData";

let inMemoryEmployerSignals: EmployerDemandSignal[] = JSON.parse(JSON.stringify(CANONICAL_EMPLOYER_SIGNALS));
let inMemoryLabourEvidence: LabourMarketEvidence[] = JSON.parse(JSON.stringify(CANONICAL_LABOUR_EVIDENCE));

export const employerValidationRepository = {
  async findAllEmployerSignals(params?: { employerId?: string; district?: string; skillId?: string }): Promise<EmployerDemandSignal[]> {
    let list = [...inMemoryEmployerSignals];
    if (params?.employerId) {
      list = list.filter((s) => s.employerId === params.employerId);
    }
    if (params?.district) {
      list = list.filter((s) => s.district.toLowerCase() === params.district!.toLowerCase());
    }
    if (params?.skillId) {
      list = list.filter((s) => s.targetSkills.some((ts) => ts.skillId === params.skillId));
    }
    return list;
  },

  async createEmployerSignal(data: Omit<EmployerDemandSignal, "id" | "createdAt">): Promise<EmployerDemandSignal> {
    const signal: EmployerDemandSignal = {
      ...data,
      id: `emp-sig-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    inMemoryEmployerSignals.unshift(signal);
    return signal;
  },

  async findAllLabourEvidence(params?: { skillId?: string; stateCode?: string; districtId?: string }): Promise<LabourMarketEvidence[]> {
    let list = [...inMemoryLabourEvidence];
    if (params?.skillId) {
      list = list.filter((e) => e.skillId === params.skillId);
    }
    if (params?.stateCode) {
      list = list.filter((e) => e.geography.stateCode.toLowerCase() === params.stateCode!.toLowerCase());
    }
    if (params?.districtId) {
      list = list.filter((e) => e.geography.districtId === params.districtId);
    }
    return list;
  },

  async createLabourEvidence(data: Omit<LabourMarketEvidence, "id">): Promise<LabourMarketEvidence> {
    const evidence: LabourMarketEvidence = {
      ...data,
      id: `evid-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    };
    inMemoryLabourEvidence.push(evidence);
    return evidence;
  },
};
