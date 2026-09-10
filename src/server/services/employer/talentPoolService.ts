// ==============================================================================
// CAREERIS TALENT POOL SERVICE
// Dynamic Talent Pools & Skill-Based Criteria Filtering
// ==============================================================================

import { employerOperationsRepository } from "@/server/repositories/employerOperationsRepository";
import { EmployerTalentPool } from "@/types/employerOperations";

export const talentPoolService = {
  async getTalentPools(employerId: string): Promise<EmployerTalentPool[]> {
    return employerOperationsRepository.getTalentPools(employerId);
  },

  async createTalentPool(pool: Partial<EmployerTalentPool>): Promise<EmployerTalentPool> {
    return employerOperationsRepository.createTalentPool(pool);
  },
};
