// ==============================================================================
// CAREERIS JOB REQUISITION SERVICE
// Skill-Mapped Requisition Lifecycle & Explainable Quality Scoring
// ==============================================================================

import { jobRequisitionRepository } from "@/server/repositories/jobRequisitionRepository";
import { roleRepository } from "@/server/repositories/roleRepository";
import { skillRepository } from "@/server/repositories/skillRepository";
import { unresolvedSkillRepository } from "@/server/repositories/unresolvedSkillRepository";
import { JobRequisition, JobQualityScore, RequisitionStatus } from "@/types/employerIntelligence";
import { auditRepository } from "@/server/repositories/auditRepository";
import { RequestAuthContext } from "@/server/middleware/authContext";

export const jobRequisitionService = {
  calculateQualityScore(req: Partial<JobRequisition>): JobQualityScore {
    let skillClarity = 0;
    let roleClarity = 0;
    let experienceClarity = 0;
    let locationClarity = 0;
    let compensationTransparency = 0;
    let descriptionCompleteness = 0;
    let educationClarity = 0;
    let assessmentClarity = 0;

    const missingInformation: string[] = [];
    const recommendedImprovements: string[] = [];

    // 1. Skill Clarity (0-100)
    if (req.requiredSkills && req.requiredSkills.length > 0) {
      const allHaveProficiency = req.requiredSkills.every((s) => s.minProficiency);
      const allHaveWeights = req.requiredSkills.every((s) => s.importanceWeight && s.importanceWeight > 0);
      skillClarity = 60 + (allHaveProficiency ? 20 : 0) + (allHaveWeights ? 20 : 0);
    } else {
      missingInformation.push("No mandatory skills defined.");
      recommendedImprovements.push("Add at least 2-3 required core skills mapped to canonical standards.");
    }

    // 2. Role Clarity (0-100)
    if (req.canonicalRoleId) {
      roleClarity = 100;
    } else {
      roleClarity = 40;
      missingInformation.push("Canonical role mapping is missing.");
      recommendedImprovements.push("Select a canonical industry role to enable automated candidate matching.");
    }

    // 3. Experience Clarity (0-100)
    if (req.minExperienceYears !== undefined) {
      experienceClarity = req.maxExperienceYears ? 100 : 80;
    } else {
      missingInformation.push("Minimum experience requirement not specified.");
    }

    // 4. Location Clarity (0-100)
    if (req.district && req.state) {
      locationClarity = req.clusterId ? 100 : 90;
    } else {
      locationClarity = 30;
      missingInformation.push("District and State location required.");
    }

    // 5. Compensation Transparency (0-100)
    if (req.salaryRangeINR && req.salaryRangeINR.min > 0 && req.salaryRangeINR.max > 0) {
      compensationTransparency = req.salaryRangeINR.isDisclosedToCandidates ? 100 : 75;
    } else {
      compensationTransparency = 20;
      missingInformation.push("Salary range not disclosed.");
      recommendedImprovements.push("Disclosing a competitive CTC range increases verified candidate applications by +35%.");
    }

    // 6. Description Completeness (0-100)
    if (req.description && req.description.length > 80) {
      descriptionCompleteness = (req.responsibilities && req.responsibilities.length >= 2) ? 100 : 80;
    } else {
      descriptionCompleteness = 35;
      missingInformation.push("Job description is too brief.");
      recommendedImprovements.push("Include day-to-day responsibilities and plant/hardware environment details.");
    }

    // 7. Education Clarity (0-100)
    if (req.educationRequirements && req.educationRequirements.length > 0) {
      educationClarity = 100;
    } else {
      educationClarity = 50;
      missingInformation.push("Minimum education qualifications not specified.");
    }

    // 8. Assessment Clarity (0-100)
    if (req.certificationsRequired && req.certificationsRequired.length > 0) {
      assessmentClarity = 100;
    } else {
      assessmentClarity = 70;
      recommendedImprovements.push("Specifying recognized certifications (e.g. ASDC Level 5 / NCVT) speeds up shortlist verification.");
    }

    const overallScore = Math.round(
      skillClarity * 0.25 +
      roleClarity * 0.15 +
      experienceClarity * 0.10 +
      locationClarity * 0.10 +
      compensationTransparency * 0.15 +
      descriptionCompleteness * 0.15 +
      educationClarity * 0.05 +
      assessmentClarity * 0.05
    );

    let grade: JobQualityScore["grade"] = "NEEDS_IMPROVEMENT";
    if (overallScore >= 90) grade = "A";
    else if (overallScore >= 75) grade = "B";
    else if (overallScore >= 60) grade = "C";

    return {
      overallScore,
      grade,
      breakdown: {
        skillClarity,
        roleClarity,
        experienceClarity,
        locationClarity,
        compensationTransparency,
        descriptionCompleteness,
        educationClarity,
        assessmentClarity,
      },
      missingInformation,
      recommendedImprovements,
      isPublishable: overallScore >= 65,
    };
  },

  async getRequisitions(params?: {
    employerId?: string;
    status?: RequisitionStatus;
    canonicalRoleId?: string;
    district?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    return jobRequisitionRepository.findAll(params);
  },

  async getRequisitionById(id: string): Promise<JobRequisition | null> {
    return jobRequisitionRepository.findById(id);
  },

  async createRequisition(
    data: Omit<JobRequisition, "id" | "requisitionNumber" | "createdAt" | "updatedAt" | "qualityScore" | "approvalHistory" | "totalApplicantsCount" | "shortlistedCount" | "interviewingCount" | "offeredCount" | "hiredCount" | "filledPositions">,
    auth: RequestAuthContext
  ): Promise<JobRequisition> {
    // 1. Resolve Canonical Role
    const role = await roleRepository.findById(data.canonicalRoleId);
    const canonicalRoleTitle = role ? role.title : data.canonicalRoleTitle || data.jobTitle;

    // 2. Validate / Resolve Skills through Canonical Skill Graph
    const resolvedRequiredSkills = await Promise.all(
      (data.requiredSkills || []).map(async (reqSkill) => {
        const canonicalSkill = await skillRepository.findById(reqSkill.skillId);
        if (!canonicalSkill) {
          // Quarantine unknown skill
          await unresolvedSkillRepository.recordUnresolved({
            rawSkillName: reqSkill.skillName,
            source: "EMPLOYER_REQUISITION_CREATION",
            employerName: data.employerName,
          });
        }
        return {
          ...reqSkill,
          skillName: canonicalSkill ? canonicalSkill.name : reqSkill.skillName,
        };
      })
    );

    // 3. Compute Quality Score
    const partialReq: Partial<JobRequisition> = {
      ...data,
      canonicalRoleTitle,
      requiredSkills: resolvedRequiredSkills,
    };
    const qualityScore = this.calculateQualityScore(partialReq);

    // 4. Create Requisition Record
    const created = await jobRequisitionRepository.create({
      ...data,
      canonicalRoleTitle,
      requiredSkills: resolvedRequiredSkills,
      filledPositions: 0,
      qualityScore,
      approvalHistory: [
        {
          stage: data.status === "OPEN" ? "APPROVED" : "SUBMITTED",
          actedBy: auth.fullName,
          actedAt: new Date().toISOString(),
          comments: `Requisition initialized with Quality Score ${qualityScore.overallScore}/100 (Grade ${qualityScore.grade}).`,
        },
      ],
      totalApplicantsCount: 0,
      shortlistedCount: 0,
      interviewingCount: 0,
      offeredCount: 0,
      hiredCount: 0,
    });

    // 5. Audit Log
    await auditRepository.record({
      userName: auth.fullName,
      userRole: auth.userRole,
      action: "JOB_REQUISITION_CREATED",
      entity: "JobRequisition",
      entityId: created.id,
      details: {
        jobTitle: created.jobTitle,
        employerId: created.employerId,
        qualityScore: qualityScore.overallScore,
        status: created.status,
      },
    });

    return created;
  },

  async updateRequisition(
    id: string,
    updates: Partial<JobRequisition>,
    auth: RequestAuthContext
  ): Promise<JobRequisition | null> {
    const existing = await jobRequisitionRepository.findById(id);
    if (!existing) return null;

    const merged = { ...existing, ...updates };
    const qualityScore = this.calculateQualityScore(merged);

    const updated = await jobRequisitionRepository.update(id, {
      ...updates,
      qualityScore,
    });

    if (updated) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "JOB_REQUISITION_UPDATED",
        entity: "JobRequisition",
        entityId: id,
        details: { fieldsUpdated: Object.keys(updates), newQualityScore: qualityScore.overallScore },
      });
    }
    return updated;
  },

  async updateStatus(
    id: string,
    status: RequisitionStatus,
    comments: string | undefined,
    auth: RequestAuthContext
  ): Promise<JobRequisition | null> {
    const updated = await jobRequisitionRepository.updateStatus(id, status, {
      stage: status === "OPEN" ? "APPROVED" : status === "CANCELLED" ? "REJECTED" : "SUBMITTED",
      actedBy: auth.fullName,
      actedAt: new Date().toISOString(),
      comments,
    });

    if (updated) {
      await auditRepository.record({
        userName: auth.fullName,
        userRole: auth.userRole,
        action: "JOB_REQUISITION_STATUS_CHANGED",
        entity: "JobRequisition",
        entityId: id,
        details: { newStatus: status, comments },
      });
    }
    return updated;
  },
};
