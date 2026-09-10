import { CandidateProfile } from "@/types";
import { ProfileCompletenessScore } from "@/types/careerJourney";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { careerGoalRepository } from "@/server/repositories/careerGoalRepository";

export const candidateProfileService = {
  async getProfile(userId = "user-cand-01"): Promise<CandidateProfile> {
    return candidateRepository.getProfile(userId);
  },

  async updateProfile(userId: string, updates: Partial<CandidateProfile>): Promise<CandidateProfile> {
    return candidateRepository.updateProfile(userId, updates);
  },

  async calculateCompleteness(userId = "user-cand-01"): Promise<ProfileCompletenessScore> {
    const profile = await candidateRepository.getProfile(userId);
    const goals = await careerGoalRepository.findByCandidateId(profile.id);

    const hasBasicInfo = !!(profile.headline && profile.summary && profile.currentDistrict);
    const hasEducation = (profile.education || []).length > 0;
    const skillsCount = (profile.skills || []).length;
    const evidenceCount = (profile.skills || []).reduce((acc, s) => acc + (s.evidenceCount || 0), 0);
    const hasExperience = (profile.experience || []).length > 0;
    const projectsCount = (profile.projects || []).length;
    const hasGoals = goals.length > 0;

    const sections = {
      basicInfo: { isComplete: hasBasicInfo, weight: 15 },
      education: { isComplete: hasEducation, weight: 15 },
      skills: { isComplete: skillsCount >= 3, weight: 20, count: skillsCount },
      evidence: { isComplete: evidenceCount >= 2, weight: 20, count: evidenceCount },
      experience: { isComplete: hasExperience, weight: 10 },
      projects: { isComplete: projectsCount >= 1, weight: 10, count: projectsCount },
      careerGoals: { isComplete: hasGoals, weight: 5 },
      preferences: { isComplete: !!profile.currentDistrict, weight: 5 },
    };

    let overallPercentage = 0;
    const missingActionItems: string[] = [];

    if (sections.basicInfo.isComplete) overallPercentage += sections.basicInfo.weight;
    else missingActionItems.push("Add a professional headline and summary to your profile.");

    if (sections.education.isComplete) overallPercentage += sections.education.weight;
    else missingActionItems.push("Add your ITI / Polytechnic / Degree educational qualifications.");

    if (sections.skills.isComplete) overallPercentage += sections.skills.weight;
    else missingActionItems.push("Add at least 3 core technical competencies.");

    if (sections.evidence.isComplete) overallPercentage += sections.evidence.weight;
    else missingActionItems.push("Complete a proctored diagnostic assessment or upload project proof to verify your skills.");

    if (sections.experience.isComplete) overallPercentage += sections.experience.weight;
    else missingActionItems.push("Add apprenticeship or work experience.");

    if (sections.projects.isComplete) overallPercentage += sections.projects.weight;
    else missingActionItems.push("Add a hands-on practical project.");

    if (sections.careerGoals.isComplete) overallPercentage += sections.careerGoals.weight;
    else missingActionItems.push("Set at least one target career goal.");

    if (sections.preferences.isComplete) overallPercentage += sections.preferences.weight;

    return {
      overallPercentage: Math.min(100, overallPercentage),
      sections,
      missingActionItems,
    };
  },
};
