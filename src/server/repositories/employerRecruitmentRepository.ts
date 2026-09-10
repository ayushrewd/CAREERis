// ==============================================================================
// CAREERIS EMPLOYER RECRUITMENT REPOSITORY
// Requisitions, Matches, Pipeline Kanban, Scorecards & Hire-vs-Train Models
// ==============================================================================

import {
  SkillFirstJobRequisition,
  CandidateMatchResultItem,
  RecruitmentPipelineRecord,
  WorkforceHireVsTrainModel,
} from "@/types/employerRecruitment";
import {
  CANONICAL_REQUISITIONS,
  CANONICAL_CANDIDATE_MATCHES,
  CANONICAL_PIPELINE_APPLICATIONS,
  CANONICAL_HIRE_VS_TRAIN,
} from "@/data/canonicalEmployerRecruitmentData";

let inMemoryRequisitions: SkillFirstJobRequisition[] = JSON.parse(
  JSON.stringify(CANONICAL_REQUISITIONS)
);
let inMemoryMatches: CandidateMatchResultItem[] = JSON.parse(
  JSON.stringify(CANONICAL_CANDIDATE_MATCHES)
);
let inMemoryPipeline: RecruitmentPipelineRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_PIPELINE_APPLICATIONS)
);
let inMemoryHireVsTrain: WorkforceHireVsTrainModel = JSON.parse(
  JSON.stringify(CANONICAL_HIRE_VS_TRAIN)
);

export const employerRecruitmentRepository = {
  async getRequisitions(employerId?: string): Promise<SkillFirstJobRequisition[]> {
    if (employerId) {
      return JSON.parse(
        JSON.stringify(inMemoryRequisitions.filter((r) => r.employerId === employerId))
      );
    }
    return JSON.parse(JSON.stringify(inMemoryRequisitions));
  },

  async getRequisitionById(reqId: string): Promise<SkillFirstJobRequisition | null> {
    const found = inMemoryRequisitions.find((r) => r.requisitionId === reqId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async createRequisition(req: Partial<SkillFirstJobRequisition>): Promise<SkillFirstJobRequisition> {
    const newReq: SkillFirstJobRequisition = {
      requisitionId: `req-${Date.now()}`,
      employerId: req.employerId || "emp-tata-motors",
      employerName: req.employerName || "Tata Motors",
      title: req.title || "Specialist Role",
      roleId: req.roleId || "role-bms-specialist",
      roleTitle: req.roleTitle || "EV Battery Specialist",
      industry: req.industry || "Automotive",
      district: req.district || "Pune",
      state: req.state || "Maharashtra",
      employmentType: req.employmentType || "FULL_TIME",
      workMode: req.workMode || "ON_SITE",
      experienceYearsRange: req.experienceYearsRange || { min: 1, max: 3 },
      salaryRangeINR: req.salaryRangeINR || { min: 500000, max: 700000 },
      skills: req.skills || [],
      healthScore: 92,
      talentAvailabilityEstimate: {
        estimatedPoolCount: 120,
        verifiedTalentCount: 40,
        hiringDifficulty: "HIGH",
        averageTimeToHireDays: 24,
      },
      status: "PUBLISHED",
      createdAt: new Date().toISOString(),
    };
    inMemoryRequisitions.push(newReq);
    return newReq;
  },

  async getMatchingCandidates(requisitionId?: string): Promise<CandidateMatchResultItem[]> {
    return JSON.parse(JSON.stringify(inMemoryMatches));
  },

  async getPipelineApplications(requisitionId?: string): Promise<RecruitmentPipelineRecord[]> {
    if (requisitionId) {
      return JSON.parse(
        JSON.stringify(inMemoryPipeline.filter((p) => p.requisitionId === requisitionId))
      );
    }
    return JSON.parse(JSON.stringify(inMemoryPipeline));
  },

  async updatePipelineStage(
    applicationId: string,
    stage: RecruitmentPipelineRecord["currentStage"],
    notes?: string
  ): Promise<RecruitmentPipelineRecord | null> {
    const found = inMemoryPipeline.find((p) => p.applicationId === applicationId);
    if (!found) return null;
    found.currentStage = stage;
    if (notes) found.recruiterNotes.push(notes);
    found.updatedAt = new Date().toISOString();
    return JSON.parse(JSON.stringify(found));
  },

  async getHireVsTrainAnalysis(): Promise<WorkforceHireVsTrainModel> {
    return JSON.parse(JSON.stringify(inMemoryHireVsTrain));
  },
};
