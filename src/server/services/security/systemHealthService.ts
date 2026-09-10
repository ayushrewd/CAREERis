// ==============================================================================
// CAREERIS SYSTEM HEALTH SERVICE
// Infrastructure Monitoring, Worker Latency & Connector Status
// ==============================================================================

import { securityAndObservabilityRepository } from "@/server/repositories/securityAndObservabilityRepository";
import { SystemServiceHealth } from "@/types/ecosystemInteroperability";

export const systemHealthService = {
  async getSystemHealth(): Promise<SystemServiceHealth[]> {
    return securityAndObservabilityRepository.getSystemServicesHealth();
  },

  async getOverallSystemStatus(): Promise<{ status: "HEALTHY" | "DEGRADED" | "DOWN"; healthyServices: number; totalServices: number }> {
    const services = await this.getSystemHealth();
    const healthy = services.filter((s) => s.status === "HEALTHY").length;
    const hasDown = services.some((s) => s.status === "DOWN");
    const hasDegraded = services.some((s) => s.status === "DEGRADED");

    return {
      status: hasDown ? "DOWN" : hasDegraded ? "DEGRADED" : "HEALTHY",
      healthyServices: healthy,
      totalServices: services.length,
    };
  },
};
