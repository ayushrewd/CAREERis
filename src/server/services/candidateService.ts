import { candidateRepository } from "@/server/repositories/candidateRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import { RequestAuthContext } from "@/server/middleware/authContext";
import { CandidateProfile, CandidateSkillItem } from "@/types";

export const candidateService = {
  async getProfile(userId = "user-cand-01"): Promise<CandidateProfile> {
    return candidateRepository.getProfile(userId);
  },

  async updateProfile(params: {
    userId: string;
    updates: Partial<CandidateProfile>;
    auth: RequestAuthContext;
  }): Promise<CandidateProfile> {
    const updated = await candidateRepository.updateProfile(params.userId, params.updates);

    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: "PROFILE_UPDATE",
      entity: "CandidateProfile",
      entityId: updated.id,
      details: { headline: updated.headline, district: updated.currentDistrict },
    });

    return updated;
  },

  async addSkill(params: {
    userId: string;
    skill: CandidateSkillItem;
    auth: RequestAuthContext;
  }): Promise<CandidateProfile> {
    const updated = await candidateRepository.addOrUpdateSkill(params.userId, params.skill);

    await auditRepository.record({
      userName: params.auth.fullName,
      userRole: params.auth.userRole,
      action: "SKILL_ADDED",
      entity: "CandidateSkill",
      entityId: params.skill.skillId,
      details: { skillName: params.skill.skillName, proficiency: params.skill.claimedProficiency },
    });

    return updated;
  },
};
