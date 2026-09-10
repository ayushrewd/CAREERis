import { describe, it, expect } from "vitest";
import { governmentCommandCenterService } from "@/server/services/government/governmentCommandCenterService";
import { stateIntelligenceService } from "@/server/services/government/stateIntelligenceService";

describe("Government Command Center & State Intelligence Service", () => {
  it("computes 10 Core Cards for national command overview", async () => {
    const overview = await governmentCommandCenterService.getNationalCommandOverview();
    expect(overview).toBeDefined();
    expect(overview.tenCoreCards).toHaveLength(10);
    expect(overview.kpis.totalNationalDemand).toBeGreaterThan(1000000);
    expect(overview.kpis.activeProgramsCount).toBeGreaterThan(0);
  });

  it("retrieves pan-India states and specific state dossiers", async () => {
    const states = await stateIntelligenceService.getAllStates();
    expect(states.length).toBeGreaterThan(5);

    const mhDossier = await stateIntelligenceService.getStateFullDossier("MH");
    expect(mhDossier).toBeDefined();
    expect(mhDossier?.state.stateName).toBe("Maharashtra");
    expect(mhDossier?.interventions.length).toBeGreaterThan(0);
  });
});
