// ==============================================================================
// CAREERIS NATIONAL POLICY INTELLIGENCE SERVICE
// Pan-India Labour Demand Aggregation, Hotspots & Emerging Skill Risk Register
// ==============================================================================

import { policyIntelligenceRepository } from "@/server/repositories/policyIntelligenceRepository";

export const nationalPolicyIntelligenceService = {
  async getNationalIntelligence(): Promise<any> {
    return policyIntelligenceRepository.getNationalMetrics();
  },

  async getCriticalAlerts(severity?: string) {
    return policyIntelligenceRepository.getAlerts(severity);
  },

  async createGovernmentAlert(alert: any) {
    return policyIntelligenceRepository.createAlert(alert);
  },
};
