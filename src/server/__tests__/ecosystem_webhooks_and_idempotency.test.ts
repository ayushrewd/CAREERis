import { describe, it, expect } from "vitest";
import { webhookService } from "@/server/services/ecosystem/webhookService";

describe("Webhook Architecture, Signature Verification & Event Dispatcher", () => {
  it("should verify webhook signatures and dispatch domain events", async () => {
    const isValid = webhookService.verifyWebhookSignature(
      JSON.stringify({ event: "CandidateShortlisted" }),
      "sha256-signature-header-value",
      "secret-key-123"
    );
    expect(isValid).toBe(true);

    const deliveries = await webhookService.dispatchDomainEvent("CandidateShortlisted", {
      candidateId: "cand-rohit-01",
      jobId: "job-ev-calibration-01",
    });

    expect(deliveries.length).toBeGreaterThan(0);
    expect(deliveries[0].status).toBe("DELIVERED");
    expect(deliveries[0].httpStatusCode).toBe(200);
  });
});
