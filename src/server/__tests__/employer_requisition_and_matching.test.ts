import { describe, it, expect } from "vitest";
import { jobRequisitionService } from "@/server/services/employer/jobRequisitionService";
import { candidateDiscoveryService } from "@/server/services/employer/candidateDiscoveryService";
import { RequestAuthContext } from "@/server/middleware/authContext";

describe("Employer Intelligence: Requisitions & Candidate Matching", () => {
  const employerAuth: RequestAuthContext = {
    userId: "user-employer-tm-01",
    fullName: "Rahul Shinde",
    email: "rahul.shinde@tatamotors.com",
    userRole: "EMPLOYER",
  };

  it("calculates explainable Job Quality Score and identifies improvements", () => {
    const quality = jobRequisitionService.calculateQualityScore({
      canonicalRoleId: "role-bms-lead",
      requiredSkills: [
        { skillId: "skill-bms", skillName: "BMS", minProficiency: "ADVANCED", isMandatory: true, importanceWeight: 10 },
      ],
      district: "Pune",
      state: "Maharashtra",
      salaryRangeINR: { min: 750000, max: 1350000, isDisclosedToCandidates: true },
      description: "Comprehensive high-voltage testing and calibration requisition for EV manufacturing plant in Chakan corridor.",
      responsibilities: ["Lead BMS calibration", "Conduct AIS 038 safety audits"],
      minExperienceYears: 2,
    });

    expect(quality.overallScore).toBeGreaterThanOrEqual(80);
    expect(quality.isPublishable).toBe(true);
    expect(quality.breakdown.skillClarity).toBeGreaterThan(0);
  });

  it("performs 7-factor explainable candidate matching against requisition", async () => {
    const results = await candidateDiscoveryService.searchCandidates({
      requisitionId: "req-tm-bms-01",
    });

    expect(results.length).toBeGreaterThan(0);
    const topMatch = results[0];
    expect(topMatch.overallMatchScore).toBeGreaterThanOrEqual(70);
    expect(topMatch.factors.skillCoverage.score).toBeGreaterThan(0);
    expect(topMatch.factors.evidenceStrength.score).toBeGreaterThan(0);
    expect(topMatch.whyThisCandidateMatches.length).toBeGreaterThan(0);
  });
});
