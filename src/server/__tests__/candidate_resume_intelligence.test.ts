import { describe, it, expect } from "vitest";
import { resumeIntelligenceService } from "@/server/services/career/resumeIntelligenceService";

describe("Resume Intelligence & ATS Optimization", () => {
  it("should extract parsed skills and projects from resume", async () => {
    const parsed = await resumeIntelligenceService.getExtractedResume("cand-rohit-01");
    expect(parsed.candidateName).toBe("Rohit Sharma");
    expect(parsed.extractedSkills.length).toBeGreaterThan(0);
    expect(parsed.extractedProjects.length).toBeGreaterThan(0);
  });

  it("should optimize resume against target job requirements", async () => {
    const opt = await resumeIntelligenceService.optimizeResumeForJob({
      candidateId: "cand-rohit-01",
      targetJobId: "job-ev-calibration-01",
    });

    expect(opt.overallMatchPercentage).toBe(88);
    expect(opt.matchedSkills.length).toBeGreaterThan(0);
    expect(opt.missingKeywords.length).toBeGreaterThan(0);
    expect(opt.actionableRecommendations.length).toBeGreaterThan(0);
  });
});
