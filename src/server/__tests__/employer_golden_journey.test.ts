import { describe, it, expect } from "vitest";
import { employerProfileService } from "@/server/services/employer/employerProfileService";
import { jobRequisitionService } from "@/server/services/employer/jobRequisitionService";
import { candidateDiscoveryService } from "@/server/services/employer/candidateDiscoveryService";
import { recruitmentPipelineService } from "@/server/services/employer/recruitmentPipelineService";
import { interviewWorkflowService } from "@/server/services/employer/interviewWorkflowService";
import { offerManagementService } from "@/server/services/employer/offerManagementService";
import { trainingPartnershipService } from "@/server/services/employer/trainingPartnershipService";
import { RequestAuthContext } from "@/server/middleware/authContext";

describe("CareerIS Master Prompt 07: Golden Employer Recruitment Journey", () => {
  const employerAuth: RequestAuthContext = {
    userId: "user-employer-tm-01",
    fullName: "Rahul Shinde",
    email: "rahul.shinde@tatamotors.com",
    userRole: "EMPLOYER",
  };

  const candidateAuth: RequestAuthContext = {
    userId: "cand-rohit-01",
    fullName: "Rohit Sharma",
    email: "rohit.sharma@domain.in",
    userRole: "CANDIDATE",
  };

  it("executes the entire employer workforce demand lifecycle from requisition to placement and feedback", async () => {
    // 1. Employer Profile Verification
    const profile = await employerProfileService.getProfile("comp-tata-motors");
    expect(profile.verification.status).toBe("VERIFIED");

    // 2. Job Requisition Creation with Canonical Skill Mapping & Quality Score
    const requisition = await jobRequisitionService.createRequisition(
      {
        employerId: profile.id,
        employerName: profile.name,
        department: "High-Voltage Battery Engineering",
        locationId: profile.operatingLocations[0].id,
        locationName: profile.operatingLocations[0].name,
        district: "Pune",
        state: "Maharashtra",
        stateCode: "MH",
        clusterId: "cluster-chakan",
        clusterName: "Chakan-Talegaon Industrial Corridor",
        jobTitle: "Battery Management System (BMS) Calibration Specialist",
        canonicalRoleId: "role-bms-lead",
        canonicalRoleTitle: "Battery Management System (BMS) Calibration Specialist",
        industryId: profile.industryId,
        employmentType: "FULL_TIME",
        workMode: "ON_SITE",
        openings: 5,
        minExperienceYears: 2,
        maxExperienceYears: 6,
        educationRequirements: [
          { level: "DIPLOMA", fieldOfStudy: "Electrical / Mechatronics", isMandatory: true },
        ],
        requiredSkills: [
          { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", minProficiency: "ADVANCED", isMandatory: true, importanceWeight: 10 },
          { skillId: "skill-can", skillName: "CAN Bus Communication", minProficiency: "INTERMEDIATE", isMandatory: true, importanceWeight: 9 },
          { skillId: "skill-hv-safety", skillName: "High-Voltage Safety Norms", minProficiency: "ADVANCED", isMandatory: true, importanceWeight: 9 },
        ],
        preferredSkills: [],
        certificationsRequired: ["ASDC Level 5 Automotive EV Specialist"],
        salaryRangeINR: { min: 800000, max: 1400000, isDisclosedToCandidates: true },
        benefits: ["On-site Transport", "Health Insurance"],
        description: "Lead calibration of EV battery management systems and validate high-voltage safety norms.",
        responsibilities: ["Calibrate BMS firmware", "Perform thermal runaway containment tests"],
        hiringPriority: "URGENT",
        hiringManagerId: "user-employer-tm-02",
        hiringManagerName: "Deepa Menon",
        assignedRecruiterId: employerAuth.userId,
        assignedRecruiterName: employerAuth.fullName,
        status: "OPEN",
      },
      employerAuth
    );

    expect(requisition).toBeDefined();
    expect(requisition.qualityScore.overallScore).toBeGreaterThanOrEqual(80);
    expect(requisition.qualityScore.grade).toBe("A");

    // 3. Candidate Discovery & Explainable Match
    const matches = await candidateDiscoveryService.searchCandidates({
      requisitionId: requisition.id,
    });
    expect(matches.length).toBeGreaterThan(0);
    const topCandidate = matches[0];
    expect(topCandidate.overallMatchScore).toBeGreaterThanOrEqual(70);

    // 4. Candidate Shortlisting in Recruitment Pipeline
    const pipelineItem = await recruitmentPipelineService.updateCandidateStage(
      "app-rohit-tm-01",
      "SHORTLISTED",
      "Shortlisted for technical interview round.",
      employerAuth
    );
    expect(pipelineItem).not.toBeNull();
    expect(pipelineItem!.currentStage).toBe("SHORTLISTED");

    // 5. Technical Panel Interview Scheduling & Scoring
    const interview = await interviewWorkflowService.scheduleInterview(
      {
        applicationId: pipelineItem!.applicationId,
        requisitionId: requisition.id,
        candidateId: topCandidate.candidateId,
        candidateName: topCandidate.candidateName,
        jobTitle: requisition.jobTitle,
        roundNumber: 1,
        roundName: "Technical Systems Diagnostic",
        format: "TECHNICAL_PANEL",
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: 60,
        locationOrMeetingLink: "Chakan Plant Building C",
        interviewerId: "user-employer-tm-02",
        interviewerName: "Deepa Menon",
      },
      employerAuth
    );
    expect(interview.status).toBe("SCHEDULED");

    const evaluated = await interviewWorkflowService.submitFeedback(
      interview.id,
      {
        overallScore: 5,
        recommendation: "STRONG_HIRE",
        evaluations: [
          { criteriaName: "TECHNICAL_SKILL", score: 5, feedbackComment: "Excellent BMS diagnostic competencies" },
        ],
        summaryComments: "Exceeds benchmark standards for Chakan EV Plant.",
        assessedSkills: [
          { skillId: "skill-bms", skillName: "Battery Management Systems", assessedProficiency: "ADVANCED" },
        ],
        submittedAt: new Date().toISOString(),
        submittedBy: "Deepa Menon",
      },
      employerAuth
    );
    expect(evaluated!.status).toBe("COMPLETED");

    // 6. Formal Employment Offer Creation
    const offer = await offerManagementService.createOffer(
      {
        applicationId: pipelineItem!.applicationId,
        requisitionId: requisition.id,
        candidateId: topCandidate.candidateId,
        candidateName: topCandidate.candidateName,
        employerId: profile.id,
        employerName: profile.name,
        roleTitle: requisition.jobTitle,
        annualCompensationINR: 1200000,
        joiningDate: "2026-04-15",
        workLocation: "Chakan EV Mega Plant, Pune",
        employmentType: "FULL_TIME",
        status: "SENT",
      },
      employerAuth
    );
    expect(offer.status).toBe("SENT");

    // 7. Candidate Offer Acceptance & Placement Execution
    const acceptedOffer = await offerManagementService.respondToOffer(offer.id, {
      status: "ACCEPTED",
      auth: candidateAuth,
    });
    expect(acceptedOffer!.status).toBe("ACCEPTED");

    // 8. Post-Hiring Employer Feedback Fusion
    const feedback = await trainingPartnershipService.submitPostHireFeedback({
      candidateId: topCandidate.candidateId,
      candidateName: topCandidate.candidateName,
      jobRole: requisition.jobTitle,
      performanceScore: 95,
      observedGaps: [],
      feedbackText: "Demonstrated instant productivity on the high-voltage test bench.",
      auth: employerAuth,
    });
    expect(feedback).toBeDefined();
    expect(feedback.performanceScore).toBe(95);
  });
});
