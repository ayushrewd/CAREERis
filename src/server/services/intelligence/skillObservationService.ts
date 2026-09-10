import { skillObservationRepository } from "@/server/repositories/skillObservationRepository";
import { SkillObservationRecord } from "@/types/intelligence";

export const skillObservationService = {
  async trackRawSkillTerm(rawTerm: string, source = "JOB_MARKET_STREAM"): Promise<SkillObservationRecord> {
    return skillObservationRepository.recordObservation(rawTerm, source);
  },

  async getEmergingCandidates(): Promise<SkillObservationRecord[]> {
    return skillObservationRepository.findAll({ status: "EMERGING_CANDIDATE" });
  },

  async getAllObservations(minCount?: number): Promise<SkillObservationRecord[]> {
    return skillObservationRepository.findAll({ minCount });
  },
};
