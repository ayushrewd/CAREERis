// ==============================================================================
// CAREERIS SECURITY & OBSERVABILITY REPOSITORY
// Audit Events, Infrastructure Health, PII Compliance & Export Tracking
// ==============================================================================

import {
  SecurityAuditEvent,
  SystemServiceHealth,
} from "@/types/ecosystemInteroperability";
import {
  CANONICAL_SECURITY_AUDIT_EVENTS,
  CANONICAL_SYSTEM_HEALTH,
} from "@/data/canonicalEcosystemData";

let inMemorySecurityEvents: SecurityAuditEvent[] = JSON.parse(
  JSON.stringify(CANONICAL_SECURITY_AUDIT_EVENTS)
);
let inMemoryHealth: SystemServiceHealth[] = JSON.parse(
  JSON.stringify(CANONICAL_SYSTEM_HEALTH)
);

export const securityAndObservabilityRepository = {
  async getSecurityAuditEvents(): Promise<SecurityAuditEvent[]> {
    return JSON.parse(JSON.stringify(inMemorySecurityEvents));
  },

  async logSecurityEvent(event: SecurityAuditEvent): Promise<SecurityAuditEvent> {
    inMemorySecurityEvents.unshift(event);
    return JSON.parse(JSON.stringify(event));
  },

  async getSystemServicesHealth(): Promise<SystemServiceHealth[]> {
    return JSON.parse(JSON.stringify(inMemoryHealth));
  },
};
