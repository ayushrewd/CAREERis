import { State, District, IndustrialCluster } from "@/types";
import { INDIA_STATES_UT, INDIA_DISTRICTS, INDUSTRIAL_CLUSTERS } from "@/lib/geography/indiaData";

export const geographyRepository = {
  async getAllStates(): Promise<State[]> {
    return [...INDIA_STATES_UT];
  },

  async findAllStates(): Promise<State[]> {
    return [...INDIA_STATES_UT];
  },

  async getStateByCode(code: string): Promise<State | null> {
    const s = INDIA_STATES_UT.find(
      (state) => state.code.toLowerCase() === code.toLowerCase() || state.id.toLowerCase() === code.toLowerCase()
    );
    return s || null;
  },

  async findStateByCode(code: string): Promise<State | null> {
    return this.getStateByCode(code);
  },

  async getAllDistricts(params?: { stateId?: string; stateCode?: string }): Promise<District[]> {
    let list = [...INDIA_DISTRICTS];
    if (params?.stateId) {
      list = list.filter((d) => d.stateId === params.stateId);
    }
    if (params?.stateCode) {
      const state = INDIA_STATES_UT.find((s) => s.code.toLowerCase() === params.stateCode?.toLowerCase());
      if (state) {
        list = list.filter((d) => d.stateId === state.id);
      }
    }
    return list;
  },

  async findDistrictsByState(stateCode: string): Promise<District[]> {
    return this.getAllDistricts({ stateCode });
  },

  async getDistrictById(id: string): Promise<District | null> {
    const q = id.toLowerCase().replace(/^dist-/, "");
    const d = INDIA_DISTRICTS.find(
      (dist) =>
        dist.id.toLowerCase() === id.toLowerCase() ||
        dist.code.toLowerCase() === id.toLowerCase() ||
        dist.name.toLowerCase() === id.toLowerCase() ||
        dist.id.toLowerCase().includes(q) ||
        dist.name.toLowerCase().includes(q)
    );
    return d || null;
  },

  async findDistrictById(id: string): Promise<District | null> {
    return this.getDistrictById(id);
  },

  async getAllClusters(params?: { districtId?: string }): Promise<IndustrialCluster[]> {
    let list = [...INDUSTRIAL_CLUSTERS];
    if (params?.districtId) {
      list = list.filter((c) => c.districtId === params.districtId);
    }
    return list;
  },

  async findAllClusters(params?: { districtId?: string }): Promise<IndustrialCluster[]> {
    return this.getAllClusters(params);
  },
};
