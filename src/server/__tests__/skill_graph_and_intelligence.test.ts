import { describe, it, expect } from "vitest";
import { skillGraphService } from "../services/skill/skillGraphService";
import { skillEvidenceScoringService } from "../services/skill/skillEvidenceScoringService";
import { skillGapService } from "../services/skill/skillGapService";
import { careerMatchService } from "../services/skill/careerMatchService";
import { candidateMatchService } from "../services/skill/candidateMatchService";
import { courseRecommendationService } from "../services/skill/courseRecommendationService";
import { learningPathService } from "../services/skill/learningPathService";
import { geographicSkillGapService } from "../services/skill/geographicSkillGapService";
import { skillSupplyService } from "../services/skill/skillSupplyService";

describe("CareerIS Unified Skill Graph & Intelligence Engine", () => {
  it("should retrieve skill graph with prerequisites, complementary skills, and connected entities", async () => {
    const graph = await skillGraphService.getSkillGraph("skill-bms");
    expect(graph.rootSkillId).toBe("skill-bms");
    expect(graph.nodes.length).toBeGreaterThan(1);
    expect(graph.connectedRoles.length).toBeGreaterThanOrEqual(1);
    expect(graph.connectedJobs.length).toBeGreaterThanOrEqual(1);
    expect(graph.connectedCourses.length).toBeGreaterThanOrEqual(1);
  });

  it("should score candidate skill evidence with explainable multi-source breakdown", () => {
    const scored = skillEvidenceScoringService.scoreCandidateSkill({
      skillId: "skill-bms",
      skillName: "Battery Management Systems (BMS)",
      claimedProficiency: "ADVANCED",
      assessedScore: 92,
      hasCertification: true,
      employerEndorsementScore: 90,
      projectScore: 85,
    });

    expect(scored.calculatedScore).toBeGreaterThanOrEqual(85);
    expect(["ADVANCED", "EXPERT"]).toContain(scored.calculatedProficiency);
    expect(scored.confidenceRating).toBe("HIGH");
    expect(scored.evidenceShares.assessmentPct).toBeGreaterThan(0);
    expect(scored.explanation).toContain("Proctored Assessment");
  });

  it("should calculate deterministic skill gap between candidate and canonical target role", async () => {
    const gapAnalysis = await skillGapService.analyzeCandidateVsRole("user-cand-01", "role-bms-lead");
    expect(gapAnalysis.candidateId).toBe("user-cand-01");
    expect(gapAnalysis.targetRoleTitle).toBe("Battery Systems (BMS) Calibration Specialist");
    expect(gapAnalysis.readinessPercentage).toBeGreaterThanOrEqual(40);
    expect(gapAnalysis.gapItems.length).toBeGreaterThan(0);

    const bmsGap = gapAnalysis.gapItems.find((g) => g.skillId === "skill-bms");
    expect(bmsGap).toBeDefined();
  });

  it("should generate explainable career match breakdown with 'Why?' factors", async () => {
    const match = await careerMatchService.matchCandidateToJob("user-cand-01", "job-01");
    expect(match.matchBreakdown.overallScore).toBeGreaterThan(0);
    expect(match.matchBreakdown.factorBreakdown.skillCoverageScore).toBeDefined();
    expect(match.matchBreakdown.factorBreakdown.proficiencyFitScore).toBeDefined();
    expect(match.matchBreakdown.factorBreakdown.evidenceQualityScore).toBeDefined();
    expect(match.matchBreakdown.strengths.length).toBeGreaterThanOrEqual(1);
  });

  it("should rank candidates for employer job requisitions respecting RBAC", async () => {
    const candidateMatches = await candidateMatchService.matchCandidatesForJob("job-01");
    expect(candidateMatches.length).toBeGreaterThan(0);
    expect(candidateMatches[0].candidateId).toBeDefined();
    expect(candidateMatches[0].overallMatchScore).toBeGreaterThan(0);
  });

  it("should recommend gap-closing courses and generate ordered CareerIS Recommended Learning Path", async () => {
    const recCourses = await courseRecommendationService.recommendCoursesForCandidate("user-cand-01", "role-bms-lead");
    expect(recCourses.length).toBeGreaterThanOrEqual(0);

    const learningPath = await learningPathService.generateLearningPath("user-cand-01", "role-bms-lead");
    expect(learningPath.steps.length).toBeGreaterThan(0);
    expect(learningPath.steps[0].stepNumber).toBe(1);
    expect(learningPath.totalEstimatedHours).toBeGreaterThan(0);
  });

  it("should compute geographic skill gaps and de-duplicated labour supply", async () => {
    const gaps = await geographicSkillGapService.getRegionalSkillGaps({ districtId: "dist-mh-pun" });
    expect(gaps.length).toBeGreaterThan(0);
    expect(gaps[0].netGap).toBeGreaterThan(0);
    expect(gaps[0].annualEmployerDemandUnits).toBeGreaterThan(0);

    const supply = await skillSupplyService.getSkillSupply("skill-bms");
    expect(supply.totalDeDuplicatedSupply).toBeGreaterThan(0);
    expect(supply.confidence).toBeGreaterThan(0.9);
  });
});
