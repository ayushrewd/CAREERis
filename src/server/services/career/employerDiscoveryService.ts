import { employerRepository } from "@/server/repositories/employerRepository";
import { candidateRepository } from "@/server/repositories/candidateRepository";
import { jobRepository } from "@/server/repositories/jobRepository";

export interface EmployerRecommendation {
  companyId: string;
  companyName: string;
  industry: string;
  headquarters: string;
  description: string;
  activeJobsCount: number;
  matchScore: number;
  matchingSkills: string[];
  topVacancies: Array<{ jobId: string; title: string; salaryRange: string }>;
}

export const employerDiscoveryService = {
  async discoverEmployers(candidateId = "user-cand-01"): Promise<EmployerRecommendation[]> {
    const candidate = await candidateRepository.findById(candidateId) || await candidateRepository.getProfile(candidateId);
    const candidateSkillIds = new Set((candidate.skills || []).map((s) => s.skillId));

    const companies = await employerRepository.findAll();
    const jobsRes = await jobRepository.findAll({ pageSize: 50 });

    const results: EmployerRecommendation[] = [];

    for (const comp of companies) {
      const compJobs = jobsRes.items.filter((j) => j.companyId === comp.id);
      const matchingSkills: string[] = [];

      for (const j of compJobs) {
        for (const req of j.requiredSkills || []) {
          if (candidateSkillIds.has(req.skillId)) {
            matchingSkills.push(req.name);
          }
        }
      }

      const uniqueMatchedSkills = Array.from(new Set(matchingSkills));
      const matchScore = uniqueMatchedSkills.length >= 2 ? 92 : uniqueMatchedSkills.length === 1 ? 75 : 50;

      results.push({
        companyId: comp.id,
        companyName: comp.name,
        industry: comp.industry || "Automotive & EV",
        headquarters: comp.headquarters || "Pune, Maharashtra",
        description: comp.description || "Leading manufacturing enterprise with active hiring pipelines.",
        activeJobsCount: compJobs.length || comp.activeJobsCount || 5,
        matchScore,
        matchingSkills: uniqueMatchedSkills,
        topVacancies: compJobs.slice(0, 3).map((j) => ({
          jobId: j.id,
          title: j.title,
          salaryRange: `₹${((j.salaryRangeINR?.min || 500000) / 100000).toFixed(1)}L - ₹${((j.salaryRangeINR?.max || 1000000) / 100000).toFixed(1)}L`,
        })),
      });
    }

    results.sort((a, b) => b.matchScore - a.matchScore);
    return results;
  },
};
