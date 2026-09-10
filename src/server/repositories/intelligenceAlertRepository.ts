import { IntelligenceAlertRecord } from "@/types/intelligence";
import { CANONICAL_INTELLIGENCE_ALERTS } from "@/data/canonicalLabourMarketData";

let inMemoryAlerts: IntelligenceAlertRecord[] = JSON.parse(JSON.stringify(CANONICAL_INTELLIGENCE_ALERTS));

export const intelligenceAlertRepository = {
  async findAll(params?: { severity?: string; status?: string; entityType?: string }): Promise<IntelligenceAlertRecord[]> {
    let list = [...inMemoryAlerts];
    if (params?.severity) {
      list = list.filter((a) => a.severity === params.severity);
    }
    if (params?.status) {
      list = list.filter((a) => a.status === params.status);
    }
    if (params?.entityType) {
      list = list.filter((a) => a.entityType === params.entityType);
    }
    return list;
  },

  async create(data: Omit<IntelligenceAlertRecord, "id" | "createdAt">): Promise<IntelligenceAlertRecord> {
    const alert: IntelligenceAlertRecord = {
      ...data,
      id: `alt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    inMemoryAlerts.unshift(alert);
    return alert;
  },

  async updateStatus(id: string, status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED"): Promise<IntelligenceAlertRecord | null> {
    const index = inMemoryAlerts.findIndex((a) => a.id === id);
    if (index === -1) return null;
    inMemoryAlerts[index].status = status;
    return inMemoryAlerts[index];
  },
};
