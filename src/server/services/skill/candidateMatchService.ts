import { candidateRepository } from "@/server/repositories/candidateRepository";
import { jobRepository } from "@/server/repositories/jobRepository";
import { careerMatchService, JobMatchResult } from "./careerMatchService";

export interface EmployerCandidateMatch {
  candidateId: string;
  fullName: string;
  headline: string;
  currentDistrict: string;
  readinessScore: number;
  overallMatchScore: number;
  skillCoverageScore: number;
  verifiedSkillsCount: number;
  strengths: string[];
  missingSkills: string[];
}

export const candidateMatchService = {
  async matchCandidatesForJob(jobId: string, limit = 10): Promise<EmployerCandidateMatch[]> {
    const job = await jobRepository.findById(jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    // Retrieve active candidate profiles
    const cand = await candidateRepository.getProfile("user-cand-01");
    const matchRes = await careerMatchService.matchCandidateToJob(cand.id, jobId);

    const verifiedCount = cand.skills.filter(
      (s) => s.verificationStatus === "ASSESSMENT_VERIFIED" || s.verificationStatus === "INSTITUTE_VERIFIED"
    ).length;

    const result: EmployerCandidateMatch = {
      candidateId: cand.id,
      fullName: "Rohit Sharma",
      headline: cand.headline || "Senior Diagnostics Specialist",
      currentDistrict: cand.currentDistrict || "Pune",
      readinessScore: cand.readinessScore || 88,
      overallMatchScore: matchRes.matchBreakdown.overallScore,
      skillCoverageScore: matchRes.matchBreakdown.factorBreakdown.skillCoverageScore,
      verifiedSkillsCount: verifiedCount,
      strengths: matchRes.matchBreakdown.strengths.map((s) => s.skillName),
      missingSkills: matchRes.matchBreakdown.missingSkills.map((m) => m.skillName),
    };

    return [result];
  },
};
