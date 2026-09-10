import { describe, it, expect } from "vitest";
import { recordAuditEvent, getAuditLogs } from "../index";

describe("Structured Audit Logging System", () => {
  it("should record an immutable audit event with metadata", () => {
    const initialCount = getAuditLogs().length;

    const newLog = recordAuditEvent({
      userId: "test-user-01",
      userName: "Test Evaluator",
      userRole: "DISTRICT_ADMIN",
      action: "DISTRICT_TARGET_UPDATED",
      entity: "DistrictPlan",
      entityId: "plan-test-01",
      details: { target: 5000 },
    });

    expect(newLog.id).toBeDefined();
    expect(newLog.action).toBe("DISTRICT_TARGET_UPDATED");
    expect(newLog.createdAt).toBeDefined();

    const logs = getAuditLogs();
    expect(logs.length).toBe(initialCount + 1);
    expect(logs[0].action).toBe("DISTRICT_TARGET_UPDATED");
  });
});
