import { describe, it, expect } from "vitest";
import { careerisCopilotService } from "@/server/services/intelligence/careerisCopilotService";

describe("CareerIS Intelligence Copilot Grounding & Structured Response Format", () => {
  it("should answer fastest growing skills query with structured multi-factor evidence", async () => {
    const res = await careerisCopilotService.ask({
      userRole: "GOVERNMENT_ADMIN",
      query: "What skills are growing fastest across India?",
    });

    expect(res).toBeDefined();
    expect(res.answer).toContain("Battery Management Systems");
    expect(res.why.length).toBeGreaterThan(0);
    expect(res.evidence.length).toBeGreaterThan(0);
    expect(res.whatItMeans).toBeDefined();
    expect(res.recommendedAction).toBeDefined();
    expect(res.confidenceScore).toBeGreaterThanOrEqual(0.9);
    expect(res.classification).toBe("FORECAST");
    expect(res.limitations.length).toBeGreaterThan(0);
  });

  it("should enforce simulation labeling on policy scenario queries", async () => {
    const res = await careerisCopilotService.ask({
      userRole: "GOVERNMENT_ADMIN",
      query: "What happens if training capacity increases by 25%?",
    });

    expect(res.classification).toBe("SIMULATION");
    expect(res.answer).toContain("SIMULATION ONLY");
    expect(res.evidence[0].dataset).toContain("Scenario Simulator");
  });
});
