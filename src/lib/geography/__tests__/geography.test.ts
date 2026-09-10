import { describe, it, expect } from "vitest";
import {
  getAllStates,
  getStateByCode,
  getDistrictsByStateId,
  getClustersByDistrictId,
  getPilotState,
  searchGeography,
} from "../index";

describe("Pan-India Geographic Hierarchy", () => {
  it("should list all states and UTs with generic schema", () => {
    const states = getAllStates();
    expect(states.length).toBeGreaterThanOrEqual(15);
    expect(states.some((s) => s.code === "MH")).toBe(true);
    expect(states.some((s) => s.code === "KA")).toBe(true);
    expect(states.some((s) => s.code === "TN")).toBe(true);
  });

  it("should accurately identify Maharashtra as the SIH pilot area", () => {
    const pilot = getPilotState();
    expect(pilot.code).toBe("MH");
    expect(pilot.isPilotArea).toBe(true);
    expect(pilot.name).toBe("Maharashtra");
  });

  it("should fetch districts for a given state", () => {
    const mhDistricts = getDistrictsByStateId("state-mh");
    expect(mhDistricts.length).toBeGreaterThanOrEqual(5);
    expect(mhDistricts.some((d) => d.name === "Pune")).toBe(true);
  });

  it("should fetch industrial clusters for Pune district", () => {
    const clusters = getClustersByDistrictId("dist-mh-pun");
    expect(clusters.length).toBeGreaterThanOrEqual(2);
    expect(clusters.some((c) => c.name.includes("Chakan"))).toBe(true);
  });

  it("should search geography across states, districts, and clusters", () => {
    const result = searchGeography("Chakan");
    expect(result.clusters.length).toBeGreaterThan(0);
    expect(result.clusters[0].name).toContain("Chakan");
  });
});
