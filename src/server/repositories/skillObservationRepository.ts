import { SkillObservationRecord } from "@/types/intelligence";
import { CANONICAL_SKILL_OBSERVATIONS } from "@/data/canonicalLabourMarketData";

let inMemoryObservations: SkillObservationRecord[] = JSON.parse(JSON.stringify(CANONICAL_SKILL_OBSERVATIONS));

export const skillObservationRepository = {
  async findAll(params?: { status?: string; minCount?: number }): Promise<SkillObservationRecord[]> {
    let list = [...inMemoryObservations];
    if (params?.status) {
      list = list.filter((o) => o.status === params.status);
    }
    if (params?.minCount) {
      list = list.filter((o) => o.observationCount >= params.minCount!);
    }
    return list;
  },

  async recordObservation(rawTerm: string, source: string): Promise<SkillObservationRecord> {
    const clean = rawTerm
      .toLowerCase()
      .replace(/[^\w\s\(\)\-\.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const existing = inMemoryObservations.find((o) => o.normalizedTerm === clean);
    if (existing) {
      existing.observationCount += 1;
      existing.lastObservedAt = new Date().toISOString();
      if (existing.observationCount > 50 && existing.status === "OBSERVED") {
        existing.status = "EMERGING_CANDIDATE";
      }
      return existing;
    }

    const newRecord: SkillObservationRecord = {
      id: `obs-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      rawTerm,
      normalizedTerm: clean,
      source,
      firstObservedAt: new Date().toISOString(),
      lastObservedAt: new Date().toISOString(),
      observationCount: 1,
      industryCount: 1,
      geographyCount: 1,
      roleCount: 1,
      confidence: 0.6,
      status: "OBSERVED",
    };
    inMemoryObservations.push(newRecord);
    return newRecord;
  },
};
