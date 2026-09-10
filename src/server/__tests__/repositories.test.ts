import { describe, it, expect } from "vitest";
import { jobRepository } from "../repositories/jobRepository";
import { candidateRepository } from "../repositories/candidateRepository";
import { applicationRepository } from "../repositories/applicationRepository";
import { assessmentRepository } from "../repositories/assessmentRepository";
import { skillRepository } from "../repositories/skillRepository";
import { employerRepository } from "../repositories/employerRepository";
import { geographyRepository } from "../repositories/geographyRepository";

describe("CareerIS Repository Layer Integration", () => {
  it("should query jobs with pagination, district filter, and keyword search", async () => {
    const res = await jobRepository.findAll({
      search: "BMS",
      district: "Pune",
      page: 1,
      pageSize: 5,
    });

    expect(res.items.length).toBeGreaterThan(0);
    expect(res.total).toBeGreaterThanOrEqual(1);
    expect(res.items[0].district).toBe("Pune");
  });

  it("should create new job in repository and retrieve by ID", async () => {
    const created = await jobRepository.create({
      companyId: "comp-tata-motors",
      companyName: "Tata Motors EV",
      title: "Cell Thermal Modeling Specialist",
      description: "Perform thermal runaway characterization for battery packs.",
      jobType: "FULL_TIME",
      minExperience: 2,
      salaryRangeINR: { min: 800000, max: 1400000 },
      openPositions: 2,
      district: "Pune",
      state: "Maharashtra",
      requiredSkills: [
        { skillId: "skill-bms", name: "Battery Management Systems (BMS)", level: "ADVANCED", isMandatory: true },
      ],
    });

    expect(created.id).toBeDefined();
    const fetched = await jobRepository.findById(created.id);
    expect(fetched?.title).toBe("Cell Thermal Modeling Specialist");
  });

  it("should update candidate profile and add verified skill", async () => {
    const initial = await candidateRepository.getProfile("user-cand-01");
    expect(initial.id).toBeDefined();

    const updated = await candidateRepository.updateProfile("user-cand-01", {
      headline: "Senior EV BMS & Diagnostics Specialist",
    });
    expect(updated.headline).toBe("Senior EV BMS & Diagnostics Specialist");

    const withSkill = await candidateRepository.addOrUpdateSkill("user-cand-01", {
      skillId: "skill-ros",
      skillName: "ROS 2 Autonomous Robotics",
      claimedProficiency: "ADVANCED",
      verificationStatus: "ASSESSMENT_VERIFIED",
      assessedScore: 92,
    });

    expect(withSkill.skills.some((s) => s.skillId === "skill-ros")).toBe(true);
  });

  it("should handle application lifecycle and interview schedules", async () => {
    const app = await applicationRepository.create({
      jobId: "job-02",
      jobTitle: "Industrial Automation Engineer",
      companyId: "comp-siemens",
      companyName: "Siemens Digital Industries",
      candidateId: "user-cand-01",
      candidateName: "Rohit Sharma",
      candidateHeadline: "Lead Diagnostics Engineer",
      matchScore: 88,
      stage: "APPLIED",
    });

    expect(app.id).toBeDefined();
    expect(app.stage).toBe("APPLIED");

    const updated = await applicationRepository.updateStage(app.id, "SHORTLISTED", "Recommended for panel");
    expect(updated?.stage).toBe("SHORTLISTED");

    const interview = await applicationRepository.createInterview({
      applicationId: app.id,
      candidateId: "user-cand-01",
      candidateName: "Rohit Sharma",
      jobTitle: "Industrial Automation Engineer",
      companyName: "Siemens Digital Industries",
      scheduledAt: "2026-04-15T11:00:00Z",
      durationMinutes: 60,
      format: "TECHNICAL_PANEL",
      locationOrLink: "Siemens Kalwa Plant",
      interviewerName: "Sanjay Deshmukh",
      status: "SCHEDULED",
    });

    expect(interview.id).toBeDefined();
    const interviews = await applicationRepository.findInterviews({ candidateId: "user-cand-01" });
    expect(interviews.some((i) => i.id === interview.id)).toBe(true);
  });

  it("should query geography hierarchy for Pan-India states and districts", async () => {
    const states = await geographyRepository.getAllStates();
    expect(states.length).toBeGreaterThanOrEqual(10);

    const mhDistricts = await geographyRepository.getAllDistricts({ stateCode: "MH" });
    expect(mhDistricts.length).toBeGreaterThanOrEqual(1);

    const pune = await geographyRepository.getDistrictById("dist-pune");
    expect(pune?.name).toBe("Pune");
  });
});
