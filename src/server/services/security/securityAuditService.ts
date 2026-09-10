// ==============================================================================
// CAREERIS SECURITY AUDIT SERVICE
// Security Events, Anomaly Detection, PII Masking & Data Export Governance
// ==============================================================================

import { securityAndObservabilityRepository } from "@/server/repositories/securityAndObservabilityRepository";
import { SecurityAuditEvent } from "@/types/ecosystemInteroperability";

export const securityAuditService = {
  async getAuditTrail(): Promise<SecurityAuditEvent[]> {
    return securityAndObservabilityRepository.getSecurityAuditEvents();
  },

  async logEvent(params: {
    userId?: string;
    organizationId?: string;
    eventType: SecurityAuditEvent["eventType"];
    ipAddress: string;
    resourceAccessed: string;
    status: "SUCCESS" | "DENIED" | "ANOMALY_DETECTED";
    details: string;
  }): Promise<SecurityAuditEvent> {
    const event: SecurityAuditEvent = {
      eventId: `sec-ev-${Date.now().toString(36)}`,
      userId: params.userId,
      organizationId: params.organizationId,
      eventType: params.eventType,
      ipAddress: params.ipAddress,
      resourceAccessed: params.resourceAccessed,
      status: params.status,
      details: params.details,
      timestamp: new Date().toISOString(),
    };

    return securityAndObservabilityRepository.logSecurityEvent(event);
  },

  maskPii(value: string, type: "EMAIL" | "PHONE" | "NAME"): string {
    if (!value) return "";
    if (type === "EMAIL") {
      const [user, domain] = value.split("@");
      return `${user.slice(0, 2)}****@${domain}`;
    }
    if (type === "PHONE") {
      return `+91-******${value.slice(-4)}`;
    }
    return `${value.slice(0, 1)}****`;
  },
};
