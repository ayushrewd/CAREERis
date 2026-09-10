// ==============================================================================
// CAREERIS SKILL-FIRST REQUISITION SERVICE
// Job Creation, Skill Weighting, Requisition Health & Talent Availability
// ==============================================================================

import { employerRecruitmentRepository } from "@/server/repositories/employerRecruitmentRepository";
import { SkillFirstJobRequisition } from "@/types/employerRecruitment";

export const skillFirstRequisitionService = {
  async getRequisitions(employerId?: string): Promise<SkillFirstJobRequisition[]> {
    return employerRecruitmentRepository.getRequisitions(employerId);
  },

  async getRequisitionById(reqId: string): Promise<SkillFirstJobRequisition | null> {
    return employerRecruitmentRepository.getRequisitionById(reqId);
  },

  async createRequisition(req: Partial<SkillFirstJobRequisition>): Promise<SkillFirstJobRequisition> {
    return employerRecruitmentRepository.createRequisition(req);
  },
};
