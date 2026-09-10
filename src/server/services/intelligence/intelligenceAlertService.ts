import { intelligenceAlertRepository } from "@/server/repositories/intelligenceAlertRepository";
import { IntelligenceAlertRecord } from "@/types/intelligence";

export const intelligenceAlertService = {
  async getActiveAlerts(params?: { severity?: string; entityType?: string }): Promise<IntelligenceAlertRecord[]> {
    return intelligenceAlertRepository.findAll({ status: "ACTIVE", ...params });
  },

  async acknowledgeAlert(id: string): Promise<IntelligenceAlertRecord | null> {
    return intelligenceAlertRepository.updateStatus(id, "ACKNOWLEDGED");
  },

  async resolveAlert(id: string): Promise<IntelligenceAlertRecord | null> {
    return intelligenceAlertRepository.updateStatus(id, "RESOLVED");
  },
};
