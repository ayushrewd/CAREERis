// ==============================================================================
// CAREERIS WORKFORCE HIRE-VS-TRAIN OPS SERVICE
// Decision Analysis: Cost, Speed, Risk & Training Partner Sourcing
// ==============================================================================

import { employerRecruitmentRepository } from "@/server/repositories/employerRecruitmentRepository";
import { WorkforceHireVsTrainModel } from "@/types/employerRecruitment";

export const workforceHireVsTrainOpsService = {
  async getHireVsTrainAnalysis(): Promise<WorkforceHireVsTrainModel> {
    return employerRecruitmentRepository.getHireVsTrainAnalysis();
  },
};
