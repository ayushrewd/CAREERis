import { INDIA_STATES_UT, INDIA_DISTRICTS, INDUSTRIAL_CLUSTERS } from "./indiaData";
import { State, District, IndustrialCluster } from "@/types";

export function getAllStates(): State[] {
  return INDIA_STATES_UT;
}

export function getStateByCode(code: string): State | undefined {
  return INDIA_STATES_UT.find(
    (s) => s.code.toLowerCase() === code.toLowerCase()
  );
}

export function getStateById(id: string): State | undefined {
  return INDIA_STATES_UT.find((s) => s.id === id);
}

export function getDistrictsByStateId(stateId: string): District[] {
  return INDIA_DISTRICTS.filter((d) => d.stateId === stateId);
}

export function getDistrictByCode(code: string): District | undefined {
  return INDIA_DISTRICTS.find(
    (d) => d.code.toLowerCase() === code.toLowerCase()
  );
}

export function getDistrictById(id: string): District | undefined {
  return INDIA_DISTRICTS.find((d) => d.id === id);
}

export function getClustersByDistrictId(districtId: string): IndustrialCluster[] {
  return INDUSTRIAL_CLUSTERS.filter((c) => c.districtId === districtId);
}

export function getPilotState(): State {
  const pilot = INDIA_STATES_UT.find((s) => s.isPilotArea);
  return pilot || INDIA_STATES_UT[0];
}

export function searchGeography(query: string): {
  states: State[];
  districts: District[];
  clusters: IndustrialCluster[];
} {
  const q = query.toLowerCase().trim();
  if (!q) return { states: [], districts: [], clusters: [] };

  const states = INDIA_STATES_UT.filter(
    (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
  );

  const districts = INDIA_DISTRICTS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.headquarters.toLowerCase().includes(q)
  );

  const clusters = INDUSTRIAL_CLUSTERS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.sectorFocus.some((sec) => sec.toLowerCase().includes(q))
  );

  return { states, districts, clusters };
}
