// ==============================================================================
// CAREERIS RECRUITMENT PIPELINE OPS SERVICE
// 7-Stage Pipeline Transitions, Recruiter Notes & Scorecards
// ==============================================================================

import { employerRecruitmentRepository } from "@/server/repositories/employerRecruitmentRepository";
import { RecruitmentPipelineRecord } from "@/types/employerRecruitment";

export const recruitmentPipelineOpsService = {
  async getPipelineApplications(requisitionId?: string): Promise<RecruitmentPipelineRecord[]> {
    return employerRecruitmentRepository.getPipelineApplications(requisitionId);
  },

  async advanceStage(
    applicationId: string,
    stage: RecruitmentPipelineRecord["currentStage"],
    notes?: string
  ): Promise<RecruitmentPipelineRecord | null> {
    return employerRecruitmentRepository.updatePipelineStage(applicationId, stage, notes);
  },
};
