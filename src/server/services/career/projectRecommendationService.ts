import { ProjectRecommendation } from "@/types/careerJourney";
import { careerProjectRepository } from "@/server/repositories/careerProjectRepository";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { careerTimelineRepository } from "@/server/repositories/careerTimelineRepository";

export const projectRecommendationService = {
  async getRecommendedProjects(candidateId = "user-cand-01", targetRoleId = "role-bms-lead"): Promise<ProjectRecommendation[]> {
    return careerProjectRepository.findAll({ targetRoleId });
  },

  async submitProject(projectId: string, candidateId = "user-cand-01", evidenceUrl = "https://github.com/project"): Promise<ProjectRecommendation | null> {
    return this.submitProjectEvidence(projectId, evidenceUrl, candidateId);
  },

  async submitProjectEvidence(projectId: string, evidenceUrl: string, candidateId = "user-cand-01"): Promise<ProjectRecommendation | null> {
    const updated = await careerProjectRepository.submitEvidence(projectId, evidenceUrl);
    if (updated) {
      // Add project to candidate profile and record timeline event
      const candidate = await candidateRepository.findById(candidateId) || await candidateRepository.getProfile(candidateId);
      const existingProjects = candidate.projects || [];
      existingProjects.push({
        id: updated.id,
        title: updated.title,
        description: updated.description,
        skillsUsed: updated.skillsAddressed.map((s) => s.skillId),
        evidenceUrl,
      });
      await candidateRepository.updateProfile(candidate.id, { projects: existingProjects });

      await careerTimelineRepository.addEvent({
        candidateId: candidate.id,
        eventType: "PROJECT_SUBMITTED",
        title: `Submitted Capstone Project: ${updated.title}`,
        description: `Uploaded practical evidence artifact for ${updated.skillsAddressed.map((s) => s.skillName).join(", ")}.`,
        entityId: updated.id,
        eventDate: new Date().toISOString().split("T")[0],
      });
    }
    return updated;
  },
};
