import { describe, it, expect } from "vitest";
import { trainingCopilotService } from "@/server/services/training/trainingCopilotService";

describe("Training AI Copilot & Grounding Engine", () => {
  it("should answer course expansion questions with RECOMMENDATION label", async () => {
    const res = await trainingCopilotService.ask({
      userRole: "TRAINING_PROVIDER",
      query: "Which courses should we expand based on employer demand?",
    });
    expect(res).toBeDefined();
    expect(res.groundingLabel).toBe("RECOMMENDATION");
    expect(res.answer).toContain("BMS");
    expect(res.groundingData.sourcesUsed.length).toBeGreaterThan(0);
  });

  it("should answer obsolescence questions with ANALYSIS label", async () => {
    const res = await trainingCopilotService.ask({
      userRole: "ITI_ADMIN",
      query: "Which course is becoming obsolete in automotive hub?",
    });
    expect(res).toBeDefined();
    expect(res.groundingLabel).toBe("ANALYSIS");
    expect(res.answer).toContain("Manual Metal Arc Welder");
    expect(res.answer).toContain("MODERNIZE");
  });

  it("should simulate equipment failure with SIMULATION label", async () => {
    const res = await trainingCopilotService.ask({
      userRole: "INSTRUCTOR",
      query: "What happens if equipment fails at ITI Aundh lab?",
    });
    expect(res).toBeDefined();
    expect(res.groundingLabel).toBe("SIMULATION");
    expect(res.answer).toContain("Battery Testing");
  });
});
