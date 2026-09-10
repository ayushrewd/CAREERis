import { describe, it, expect } from "vitest";
import { skillPrioritizationService } from "@/server/services/career/skillPrioritizationService";
import { personalizedLearningService } from "@/server/services/career/personalizedLearningService";
import { projectRecommendationService } from "@/server/services/career/projectRecommendationService";

describe("Career Journey: Prioritization, Learning Paths & Projects", () => {
  it("prioritizes missing skills with multi-factor weighting and career impact", async () => {
    const prioritized = await skillPrioritizationService.getPrioritizedSkills("cand-rohit-01", "role-bms-lead");
    expect(prioritized.length).toBeGreaterThan(0);
    expect(prioritized[0].priorityRank).toBe(1);
    expect(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).toContain(prioritized[0].priorityLevel);
    expect(prioritized[0].reasons.annualMarketDemand).toBeGreaterThan(0);
  });

  it("generates closed-loop structured milestones for learning paths", async () => {
    const path = await personalizedLearningService.generatePersonalizedPath("cand-rohit-01", "role-bms-lead");
    expect(path.milestones.length).toBeGreaterThanOrEqual(4);

    const stages = path.milestones.map((m) => m.stage);
    expect(stages).toContain("TARGET_ROLE");
    expect(stages).toContain("PREREQUISITE");
    expect(stages).toContain("COURSE");
    expect(stages).toContain("PROJECT");
    expect(stages).toContain("ASSESSMENT");
    expect(stages).toContain("JOB_APPLICATION");
  });

  it("retrieves hands-on capstone projects and handles evidence submission", async () => {
    const projects = await projectRecommendationService.getRecommendedProjects("cand-rohit-01", "role-bms-lead");
    expect(projects.length).toBeGreaterThan(0);

    const targetProj = projects[0];
    expect(targetProj.skillsAddressed.length).toBeGreaterThan(0);

    const submitted = await projectRecommendationService.submitProjectEvidence(
      targetProj.id,
      "https://careeris.gov.in/evidence/rohit-telemetry-test.csv",
      "cand-rohit-01"
    );
    expect(submitted?.isCompleted).toBe(true);
  });
});
