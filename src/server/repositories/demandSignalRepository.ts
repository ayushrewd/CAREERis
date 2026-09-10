import { DemandSignalRecord } from "@/types/intelligence";
import { CANONICAL_DEMAND_SIGNALS } from "@/data/canonicalLabourMarketData";

let inMemoryDemands: DemandSignalRecord[] = JSON.parse(JSON.stringify(CANONICAL_DEMAND_SIGNALS));

export const demandSignalRepository = {
  async findAll(params?: {
    skillId?: string;
    roleId?: string;
    industryId?: string;
    stateCode?: string;
    districtId?: string;
    period?: string;
    limit?: number;
  }): Promise<DemandSignalRecord[]> {
    let list = [...inMemoryDemands];
    if (params?.skillId) {
      list = list.filter((d) => d.skillId === params.skillId);
    }
    if (params?.roleId) {
      list = list.filter((d) => d.roleId === params.roleId);
    }
    if (params?.industryId) {
      list = list.filter((d) => d.industryId === params.industryId);
    }
    if (params?.stateCode) {
      list = list.filter((d) => d.stateCode.toLowerCase() === params.stateCode!.toLowerCase());
    }
    if (params?.districtId) {
      list = list.filter((d) => d.districtId === params.districtId);
    }
    if (params?.period) {
      list = list.filter((d) => d.period === params.period);
    }
    const limit = params?.limit || 100;
    return list.slice(0, limit);
  },

  async insertBatch(signals: Omit<DemandSignalRecord, "id" | "createdAt">[]): Promise<DemandSignalRecord[]> {
    const created: DemandSignalRecord[] = signals.map((s) => ({
      ...s,
      id: `dem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    }));
    inMemoryDemands.push(...created);
    return created;
  },

  async countTotal(): Promise<number> {
    return inMemoryDemands.length;
  },
};
