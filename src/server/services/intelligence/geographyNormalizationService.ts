import { geographyRepository } from "@/server/repositories/geographyRepository";
import { State, District, IndustrialCluster } from "@/types";

export interface GeographyResolutionResult {
  status: "RESOLVED" | "GEOGRAPHY_UNRESOLVED";
  rawLocation: string;
  country: string;
  state?: State;
  district?: District;
  cluster?: IndustrialCluster;
  confidence: number;
}

export const geographyNormalizationService = {
  async resolveLocation(rawLocation: string): Promise<GeographyResolutionResult> {
    if (!rawLocation || !rawLocation.trim()) {
      return {
        status: "GEOGRAPHY_UNRESOLVED",
        rawLocation: rawLocation || "",
        country: "India",
        confidence: 0,
      };
    }

    const clean = rawLocation.toLowerCase().trim();
    const states = await geographyRepository.findAllStates();
    const clusters = await geographyRepository.findAllClusters();

    // 1. Check Industrial Clusters first (high granularity)
    for (const cluster of clusters) {
      if (clean.includes(cluster.name.toLowerCase()) || clean.includes(cluster.id.toLowerCase())) {
        const district = await geographyRepository.findDistrictById(cluster.districtId);
        const state = district ? states.find((s) => s.id === district.stateId) : undefined;
        return {
          status: "RESOLVED",
          rawLocation,
          country: "India",
          state,
          district: district || undefined,
          cluster,
          confidence: 0.98,
        };
      }
    }

    // 2. Check Districts
    for (const state of states) {
      const districts = await geographyRepository.findDistrictsByState(state.code);
      for (const dist of districts) {
        if (clean.includes(dist.name.toLowerCase()) || clean.includes(dist.id.toLowerCase())) {
          return {
            status: "RESOLVED",
            rawLocation,
            country: "India",
            state,
            district: dist,
            confidence: 0.95,
          };
        }
      }
    }

    // 3. Check State-level match
    for (const state of states) {
      if (
        clean.includes(state.name.toLowerCase()) ||
        clean.includes(state.code.toLowerCase()) ||
        clean.includes(state.capital.toLowerCase())
      ) {
        return {
          status: "RESOLVED",
          rawLocation,
          country: "India",
          state,
          confidence: 0.85,
        };
      }
    }

    // 4. If unrecognized
    return {
      status: "GEOGRAPHY_UNRESOLVED",
      rawLocation,
      country: "India",
      confidence: 0.0,
    };
  },
};
