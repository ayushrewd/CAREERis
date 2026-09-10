import { describe, it, expect } from "vitest";
import { trainingRequestMarketplaceService } from "@/server/services/training/trainingRequestMarketplaceService";

describe("Training Demand Request Marketplace & Provider Capacity Matching", () => {
  it("should retrieve training demand requests with provider quotes", async () => {
    const requests = await trainingRequestMarketplaceService.getTrainingRequests();
    expect(requests.length).toBeGreaterThan(0);
    expect(requests[0].headcountNeeded).toBe(50);
    expect(requests[0].responses.length).toBeGreaterThan(0);
    expect(requests[0].responses[0].providerName).toContain("Government ITI Aundh");
  });

  it("should allow employers to submit training demand and receive provider capacity responses", async () => {
    const newReq = await trainingRequestMarketplaceService.createTrainingRequest({
      employerId: "emp-tata-motors",
      employerName: "Tata Motors",
      roleTargetTitle: "5-Axis CNC Specialist",
      headcountNeeded: 25,
      requiredSkills: ["5-Axis CNC Milling"],
      targetDistrict: "Pune",
    });

    expect(newReq.requestId).toBeDefined();
    expect(newReq.status).toBe("OPEN");

    const updated = await trainingRequestMarketplaceService.submitProviderResponse(newReq.requestId, {
      providerId: "inst-iti-ambattur-02",
      providerName: "Government ITI Ambattur",
      offeredCapacity: 25,
      courseTitle: "Dual-System 5-Axis CNC Machining",
      durationWeeks: 6,
      quotePerTraineeINR: 15000,
      trainerReadinessScore: 94,
      equipmentReadinessScore: 92,
    });

    expect(updated?.status).toBe("RESPONDED");
    expect(updated?.responses.length).toBe(1);
  });
});
