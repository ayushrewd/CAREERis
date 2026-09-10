import { describe, it, expect } from "vitest";
import { candidateProfileService } from "@/server/services/career/candidateProfileService";
import { careerGoalService } from "@/server/services/career/careerGoalService";
import { careerReadinessService } from "@/server/services/career/careerReadinessService";
import { projectRecommendationService } from "@/server/services/career/projectRecommendationService";
import { jobRequisitionService } from "@/server/services/employer/jobRequisitionService";
import { candidateDiscoveryService } from "@/server/services/employer/candidateDiscoveryService";
import { applicationService } from "@/server/services/applicationService";
import { recruitmentPipelineService } from "@/server/services/employer/recruitmentPipelineService";
import { interviewWorkflowService } from "@/server/services/employer/interviewWorkflowService";
import { offerManagementService } from "@/server/services/employer/offerManagementService";
import { trainingPartnershipService } from "@/server/services/employer/trainingPartnershipService";
import { careerTimelineService } from "@/server/services/career/careerTimelineService";
import { RequestAuthContext } from "@/server/middleware/authContext";

describe("CareerIS Master Prompt 07: Golden Two-Sided Employment Intelligence Journey", () => {
  const candidateAuth: RequestAuthContext = {
    userId: "cand-two-sided-01",
    fullName: "Rohit Sharma",
    email: "rohit.sharma@domain.in",
    userRole: "CANDIDATE",
  };

  const employerAuth: RequestAuthContext = {
    userId: "user-employer-tm-01",
    fullName: "Rahul Shinde",
    email: "rahul.shinde@tatamotors.com",
    userRole: "EMPLOYER",
  };

  it("executes the end-to-end two-sided closed loop connecting candidate career journey with employer recruitment intelligence", async () => {
    // ------------------------------------------------------------------------
    // CANDIDATE SIDE: GOAL, READINESS & SKILL CREDENTIALING
    // ------------------------------------------------------------------------

    // 1. Candidate Profile & Readiness
    const profile = await candidateProfileService.getProfile(candidateAuth.userId);
    expect(profile).toBeDefined();

    // 2. Candidate Defines Career Goal
    const goal = await careerGoalService.addGoal({
      candidateId: candidateAuth.userId,
      targetRoleId: "role-bms-lead",
      targetRoleTitle: "Battery Management System (BMS) Calibration Specialist",
      targetIndustryId: "ind-auto-ev",
      targetIndustryName: "Automotive & Electric Mobility",
      targetGeography: { stateCode: "MH", districtName: "Pune" },
      targetSalaryRangeINR: { min: 750000, max: 1350000 },
      targetTimelineMonths: 6,
      priority: "PRIMARY",
    });
    expect(goal).toBeDefined();

    // 3. 7-Factor Readiness Diagnostic
    const readiness = await careerReadinessService.calculateReadiness(candidateAuth.userId, goal.targetRoleId);
    expect(readiness.overallReadinessScore).toBeGreaterThanOrEqual(60);

    // 4. Candidate Submits Practical Hardware Capstone Project
    const projectSubmission = await projectRecommendationService.submitProject(
      "proj-bms-01",
      candidateAuth.userId,
      "https://github.com/candidate/bms-hardware-chakan"
    );
    expect(projectSubmission).not.toBeNull();

    // ------------------------------------------------------------------------
    // EMPLOYER SIDE: WORKFORCE DEMAND & JOB REQUISITION
    // ------------------------------------------------------------------------

    // 5. Employer Creates Skill-Mapped Requisition
    const requisition = await jobRequisitionService.createRequisition(
      {
        employerId: "comp-tata-motors",
        employerName: "Tata Motors EV Division",
        department: "Battery Systems Division",
        locationId: "loc-tm-pune",
        locationName: "Pune Pimpri & Chakan Plant",
        district: "Pune",
        state: "Maharashtra",
        stateCode: "MH",
        jobTitle: "Battery Management System (BMS) Calibration Specialist",
        canonicalRoleId: "role-bms-lead",
        canonicalRoleTitle: "Battery Management System (BMS) Calibration Specialist",
        industryId: "ind-auto-ev",
        employmentType: "FULL_TIME",
        workMode: "ON_SITE",
        openings: 4,
        minExperienceYears: 2,
        educationRequirements: [{ level: "DIPLOMA", fieldOfStudy: "Mechatronics / Electrical", isMandatory: true }],
        requiredSkills: [
          { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", minProficiency: "ADVANCED", isMandatory: true, importanceWeight: 10 },
          { skillId: "skill-can", skillName: "CAN Bus Communication", minProficiency: "INTERMEDIATE", isMandatory: true, importanceWeight: 9 },
        ],
        preferredSkills: [],
        certificationsRequired: ["ASDC Level 5 Automotive EV Specialist"],
        salaryRangeINR: { min: 750000, max: 1350000, isDisclosedToCandidates: true },
        benefits: ["Transport", "Health Insurance"],
        description: "High-voltage test bench calibration role at Chakan facility.",
        responsibilities: ["Validate cell balancing algorithms", "Ensure AIS 038 compliance"],
        hiringPriority: "URGENT",
        hiringManagerId: "user-employer-tm-02",
        hiringManagerName: "Deepa Menon",
        assignedRecruiterId: employerAuth.userId,
        assignedRecruiterName: employerAuth.fullName,
        status: "OPEN",
      },
      employerAuth
    );
    expect(requisition.qualityScore.isPublishable).toBe(true);

    // ------------------------------------------------------------------------
    // TWO-SIDED INTERSECTION: SKILL GRAPH MATCHING & APPLICATION
    // ------------------------------------------------------------------------

    // 6. Skill Graph Matches Candidate with Requisition
    const match = await candidateDiscoveryService.getCandidateMatchDossier(profile.id, requisition.id);
    expect(match).not.toBeNull();
    expect(match!.overallMatchScore).toBeGreaterThanOrEqual(70);
    expect(match!.matchingSkills.length).toBeGreaterThan(0);

    // 7. Candidate Applies for Requisition
    const application = await applicationService.applyForJob({
      candidateId: profile.id,
      jobId: "job-01",
      coverLetter: "Submitting verified ASDC Level 5 Skill Passport for BMS Specialist vacancy.",
    });
    expect(application).toBeDefined();

    // 8. Employer Shortlists Candidate
    const pipelineItem = await recruitmentPipelineService.updateCandidateStage(
      application.id,
      "SHORTLISTED",
      "Shortlisted based on 92% Skill Graph match",
      employerAuth
    );
    expect(pipelineItem).not.toBeNull();
    expect(pipelineItem!.currentStage).toBe("SHORTLISTED");

    // 9. Employer Schedules & Evaluates Technical Panel
    const interview = await interviewWorkflowService.scheduleInterview(
      {
        applicationId: application.id,
        requisitionId: requisition.id,
        candidateId: profile.id,
        candidateName: profile.headline ? "Rohit Sharma" : "Candidate",
        jobTitle: requisition.jobTitle,
        roundNumber: 1,
        roundName: "Technical Systems Diagnostic",
        format: "TECHNICAL_PANEL",
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: 60,
        locationOrMeetingLink: "Chakan Plant",
        interviewerId: "user-employer-tm-02",
        interviewerName: "Deepa Menon",
      },
      employerAuth
    );
    expect(interview.status).toBe("SCHEDULED");

    const feedback = await interviewWorkflowService.submitFeedback(
      interview.id,
      {
        overallScore: 5,
        recommendation: "STRONG_HIRE",
        evaluations: [{ criteriaName: "TECHNICAL_SKILL", score: 5, feedbackComment: "Passed test bench test" }],
        summaryComments: "Exemplary hands-on competency.",
        assessedSkills: [{ skillId: "skill-bms", skillName: "BMS", assessedProficiency: "ADVANCED" }],
        submittedAt: new Date().toISOString(),
        submittedBy: "Deepa Menon",
      },
      employerAuth
    );
    expect(feedback!.status).toBe("COMPLETED");

    // 10. Employer Extends Formal Offer
    const offer = await offerManagementService.createOffer(
      {
        applicationId: application.id,
        requisitionId: requisition.id,
        candidateId: profile.id,
        candidateName: "Rohit Sharma",
        employerId: "comp-tata-motors",
        employerName: "Tata Motors EV Division",
        roleTitle: requisition.jobTitle,
        annualCompensationINR: 1250000,
        joiningDate: "2026-05-01",
        workLocation: "Chakan EV Plant, Pune",
        employmentType: "FULL_TIME",
        status: "SENT",
      },
      employerAuth
    );
    expect(offer.status).toBe("SENT");

    // 11. Candidate Accepts Offer -> Placement Closed
    const accepted = await offerManagementService.respondToOffer(offer.id, {
      status: "ACCEPTED",
      auth: candidateAuth,
    });
    expect(accepted!.status).toBe("ACCEPTED");

    // 12. Post-Hiring Feedback Closes the Loop into Intelligence Engine
    const postHireFeedback = await trainingPartnershipService.submitPostHireFeedback({
      candidateId: profile.id,
      candidateName: "Rohit Sharma",
      jobRole: requisition.jobTitle,
      performanceScore: 96,
      observedGaps: [],
      feedbackText: "Flawless calibration execution on the high-voltage pack line.",
      auth: employerAuth,
    });
    expect(postHireFeedback).toBeDefined();

    // 13. Verify Career Timeline Milestone is Persisted
    const timeline = await careerTimelineService.getTimeline(profile.id);
    expect(timeline.some((e) => e.eventType === "EMPLOYMENT_STARTED")).toBe(true);
  });
});
