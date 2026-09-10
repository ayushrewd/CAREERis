import { describe, it, expect, beforeEach } from "vitest";
import { platformStore } from "../platformStore";
import { DEMO_JOBS, DEMO_CANDIDATE } from "@/data/demoData";

describe("CareerIS PlatformStore Cross-Role Integration", () => {
  it("should compute explainable match breakdown with multidimensional scores", () => {
    const job = DEMO_JOBS[0]; // Tata Motors BMS Specialist
    const candidate = DEMO_CANDIDATE; // Rohit Sharma

    const breakdown = platformStore.calculateMatchBreakdown(job, candidate);

    expect(breakdown.overallMatchPercentage).toBeGreaterThanOrEqual(70);
    expect(breakdown.skillMatchPercentage).toBeGreaterThan(0);
    expect(breakdown.expMatchPercentage).toBeGreaterThan(0);
    expect(breakdown.locationFitPercentage).toBe(100); // Both Pune
    expect(breakdown.strongMatches.length).toBeGreaterThan(0);
    expect(Array.isArray(breakdown.missingSkills)).toBe(true);
  });

  it("should apply for a job and persist application record in pipeline", () => {
    const job = DEMO_JOBS[2]; // Unapplied job
    const app = platformStore.applyForJob({
      jobId: job.id,
      coverNote: "Testing candidate application flow with verified credentials.",
    });

    expect(app).toBeDefined();
    expect(app.jobId).toBe(job.id);
    expect(app.stage).toBe("APPLIED");
    expect(app.candidateName).toBe("Rohit Sharma");

    const apps = platformStore.getApplicationsByCandidate(DEMO_CANDIDATE.id);
    expect(apps.some((a) => a.id === app.id)).toBe(true);
  });

  it("should transition application stages across recruitment workflow", () => {
    const apps = platformStore.getApplications();
    const targetApp = apps[0];

    platformStore.updateApplicationStage(targetApp.id, "SHORTLISTED", "Shortlisted for panel round");

    const updated = platformStore.getApplications().find((a) => a.id === targetApp.id);
    expect(updated?.stage).toBe("SHORTLISTED");
    expect(updated?.feedbackNotes).toBe("Shortlisted for panel round");
  });

  it("should grade assessment attempts, calculate score, and grant verified skill badge", () => {
    const asmt = platformStore.getAssessments()[0]; // BMS assessment
    expect(asmt).toBeDefined();

    // Answer all questions correctly
    const answers: Record<string, number> = {};
    asmt.questions.forEach((q) => {
      answers[q.id] = q.correctOptionIndex;
    });

    const attempt = platformStore.submitAssessmentAttempt({
      assessmentId: asmt.id,
      answers,
    });

    expect(attempt.score).toBe(100);
    expect(attempt.isPassed).toBe(true);
    expect(attempt.proficiencyGranted).toBe("EXPERT");

    // Verify candidate's Skill Passport updated
    const candidate = platformStore.getCandidateProfile();
    const verifiedSkill = candidate.skills.find((s) => s.skillId === asmt.skillId);

    expect(verifiedSkill).toBeDefined();
    expect(verifiedSkill?.verificationStatus).toBe("ASSESSMENT_VERIFIED");
    expect(verifiedSkill?.assessedScore).toBe(100);
  });

  it("should create new job requisition with skill requirements and broadcast notifications", () => {
    const newJob = platformStore.createJob({
      companyId: "comp-tata-motors",
      companyName: "Tata Motors EV",
      title: "EV Powertrain Thermal Calibration Lead",
      description: "Lead thermal runaway validation for next-gen battery packs.",
      jobType: "FULL_TIME",
      minExperience: 3,
      maxExperience: 6,
      salaryRangeINR: { min: 900000, max: 1600000 },
      openPositions: 3,
      district: "Pune",
      state: "Maharashtra",
      requiredSkills: [
        { skillId: "skill-bms", name: "Battery Management Systems (BMS)", level: "EXPERT", isMandatory: true },
      ],
    });

    expect(newJob.id).toBeDefined();
    expect(platformStore.getJobById(newJob.id)).toBeDefined();

    const notifs = platformStore.getNotifications();
    expect(notifs.some((n) => n.title.includes("New Requisition"))).toBe(true);
  });

  it("should schedule interview and transition application stage", () => {
    const apps = platformStore.getApplications();
    const app = apps[0];

    const interview = platformStore.scheduleInterview({
      applicationId: app.id,
      scheduledAt: "2026-03-10T10:00:00Z",
      durationMinutes: 45,
      format: "TECHNICAL_PANEL",
      locationOrLink: "Chakan Plant 2 Gate 3",
      interviewerName: "Dr. Anand Joshi",
      notes: "CAN Packet analysis interview",
    });

    expect(interview.id).toBeDefined();
    expect(interview.status).toBe("SCHEDULED");

    const updatedApp = platformStore.getApplications().find((a) => a.id === app.id);
    expect(updatedApp?.stage).toBe("INTERVIEW_SCHEDULED");
  });

  it("should send direct messages between candidate and recruiter", () => {
    const msg = platformStore.sendMessage({
      conversationId: "conv-rohit-tata",
      senderId: "user-cand-01",
      senderName: "Rohit Sharma",
      senderRole: "CANDIDATE",
      recipientId: "user-emp-01",
      recipientName: "Priya Mehta",
      content: "I have uploaded my latest test bench logs.",
    });

    expect(msg.id).toBeDefined();
    expect(msg.content).toBe("I have uploaded my latest test bench logs.");

    const thread = platformStore.getMessages("conv-rohit-tata");
    expect(thread.some((m) => m.id === msg.id)).toBe(true);
  });
});
