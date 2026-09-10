// ==============================================================================
// CAREERIS PREDICTIVE ALERT REPOSITORY
// Predictive Early Warnings & Signal Fusion Registry
// ==============================================================================

import { PredictiveEarlyWarningAlert } from "@/types/predictiveIntelligence";
import { CANONICAL_PREDICTIVE_ALERTS } from "@/data/canonicalEarlyWarningsData";

let inMemoryAlerts: PredictiveEarlyWarningAlert[] = JSON.parse(
  JSON.stringify(CANONICAL_PREDICTIVE_ALERTS)
);

export const predictiveAlertRepository = {
  async getAllAlerts(): Promise<PredictiveEarlyWarningAlert[]> {
    return JSON.parse(JSON.stringify(inMemoryAlerts));
  },

  async getAlertById(alertId: string): Promise<PredictiveEarlyWarningAlert | null> {
    const found = inMemoryAlerts.find((a) => a.alertId === alertId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },
};
