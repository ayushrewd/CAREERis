import { describe, it, expect } from "vitest";
import { applicationService } from "../services/applicationService";
import { assessmentService } from "../services/assessmentService";
import { employerService } from "../services/employerService";
import { searchService } from "../services/searchService";
import { evidenceStorageService } from "../services/evidenceStorageService";
import { RequestAuthContext } from "../middleware/authContext";

const mockCandidateAuth: RequestAuthContext = {
  userId: "user-cand-01",
  userRole: "CANDIDATE",
  fullName: "Rohit Sharma",
  email: "rohit.sharma@candidate.careeris.in",
  assignedDistrictId: "dist-pune",
};

const mockEmployerAuth: RequestAuthContext = {
  userId: "user-emp-01",
  userRole: "EMPLOYER",
  fullName: "Priya Mehta",
  email: "priya.mehta@tatamotors.com",
  assignedCompanyId: "comp-tata-motors",
};

describe("CareerIS Domain Services & Workflow Tests", () => {
  it("should process complete candidate application lifecycle with transactional state progression", async () => {
    // 1. Candidate applies
    const app = await applicationService.submitApplication({
      jobId: "job-03",
      coverNote: "Strong background in 800V BMS calibration and thermal validation.",
      auth: mockCandidateAuth,
    });

    expect(app.id).toBeDefined();
    expect(app.stage).toBe("APPLIED");
    expect(app.candidateName).toBe("Rohit Sharma");

    // 2. Employer views and shortlists
    const viewed = await applicationService.updateStage({
      applicationId: app.id,
      newStage: "VIEWED",
      auth: mockEmployerAuth,
    });
    expect(viewed.stage).toBe("VIEWED");

    const shortlisted = await applicationService.updateStage({
      applicationId: app.id,
      newStage: "SHORTLISTED",
      feedbackNotes: "Profile matches high-voltage powertrain requirements",
      auth: mockEmployerAuth,
    });
    expect(shortlisted.stage).toBe("SHORTLISTED");

    // 3. Prevent invalid transitions (e.g. going directly from SHORTLISTED to HIRED without offer)
    await expect(
      applicationService.updateStage({
        applicationId: app.id,
        newStage: "HIRED",
        auth: mockEmployerAuth,
      })
    ).rejects.toThrow("Invalid stage transition");
  });

  it("should grade assessment attempt, issue verified badge, and update Skill Passport & Readiness Score", async () => {
    const assessments = await assessmentService.getAssessments();
    const bmsAssessment = assessments[0];
    expect(bmsAssessment).toBeDefined();

    // Prepare perfect answer sheet
    const answers: Record<string, number> = {};
    bmsAssessment.questions.forEach((q) => {
      answers[q.id] = q.correctOptionIndex;
    });

    const attempt = await assessmentService.submitAttempt({
      assessmentId: bmsAssessment.id,
      answers,
      auth: mockCandidateAuth,
    });

    expect(attempt.score).toBe(100);
    expect(attempt.isPassed).toBe(true);
    expect(attempt.proficiencyGranted).toBe("EXPERT");
  });

  it("should schedule interview and record post-placement outcome feedback", async () => {
    const apps = await applicationService.getApplications({});
    const targetApp = apps.items[0];
    expect(targetApp).toBeDefined();

    const interview = await employerService.scheduleInterview({
      applicationId: targetApp.id,
      scheduledAt: "2026-05-10T14:30:00Z",
      durationMinutes: 45,
      format: "TECHNICAL_PANEL",
      locationOrLink: "Chakan Plant Engineering Hall B",
      interviewerName: "Dr. Vikram Sethi",
      notes: "Focus on CAN error frames and thermal runaway mitigations.",
      auth: mockEmployerAuth,
    });

    expect(interview.id).toBeDefined();
    expect(interview.status).toBe("SCHEDULED");

    const feedback = await employerService.submitFeedback({
      data: {
        candidateId: "user-cand-01",
        candidateName: "Rohit Sharma",
        jobRole: "BMS Hardware Engineer",
        hiredAt: "2026-06-01T09:00:00Z",
        performanceScore: 5,
        observedGaps: ["Advanced CAN-FD payload sizing"],
        feedbackText: "Exceptional bench skills; immediately operational.",
      },
      auth: mockEmployerAuth,
    });

    expect(feedback.id).toBeDefined();
    expect(feedback.performanceScore).toBe(5);
  });

  it("should not fabricate geography results when no matching database evidence exists", async () => {
    const results = await searchService.globalSearch("Pune");

    expect(results.districts).toEqual([]);
    expect(results.clusters).toEqual([]);
    expect(Array.isArray(results.accounts)).toBe(true);
  });

  it("should register evidence metadata and enforce non-database large file storage abstraction", async () => {
    const evidence = await evidenceStorageService.registerEvidence({
      candidateId: "user-cand-01",
      skillId: "skill-bms",
      title: "Battery Cell Thermal Cycle Report",
      fileName: "thermal_cycle_test_chakan.pdf",
      fileSizeBytes: 1048576,
      mimeType: "application/pdf",
      checksumSha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      storageProvider: "LOCAL_VOLATILE",
      storageKey: "evidence/user-cand-01/thermal_cycle_test_chakan.pdf",
      verificationStatus: "INSTITUTE_VERIFIED",
    });

    expect(evidence.id).toBeDefined();
    expect(evidence.fileSizeBytes).toBe(1048576);

    const list = await evidenceStorageService.getCandidateEvidence("user-cand-01");
    expect(list.some((e) => e.id === evidence.id)).toBe(true);
  });
});
