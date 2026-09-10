import { DataQualityReport } from "@/types/intelligence";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";

export const dataQualityService = {
  async validateJobMarketPayload(record: Record<string, any>): Promise<DataQualityReport> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingFields: string[] = [];
    let score = 100;

    // 1. Mandatory Fields Check
    if (!record.jobTitle && !record.jobTitleRaw) {
      missingFields.push("jobTitle");
      errors.push("Missing mandatory job title.");
      score -= 30;
    }
    if (!record.employerName && !record.company) {
      missingFields.push("employerName");
      warnings.push("Missing employer name; defaulted to anonymous recruiter.");
      score -= 10;
    }
    if (!record.location && !record.locationRaw && !record.districtName) {
      missingFields.push("location");
      errors.push("Missing geographic location.");
      score -= 25;
    }

    // 2. Date Validation
    if (record.postedAt || record.postedDate) {
      const parsedDate = new Date(record.postedAt || record.postedDate);
      if (isNaN(parsedDate.getTime())) {
        errors.push("Invalid date format in postedAt field.");
        score -= 15;
      }
    } else {
      warnings.push("Missing post date; defaulted to ingestion timestamp.");
      score -= 5;
    }

    // 3. Outlier Value Validation (Salary)
    if (record.salaryMin !== undefined && record.salaryMax !== undefined) {
      if (record.salaryMin > record.salaryMax) {
        errors.push("Conflicting salary bounds: salaryMin > salaryMax.");
        score -= 20;
      }
      if (record.salaryMax > 50000000) {
        warnings.push("Outlier salary value detected (> ₹5 Crore). Flagged for audit.");
        score -= 10;
      }
    }

    // 4. Skill References Check
    const rawSkills: string[] = record.skillsRaw || record.rawSkills || [];
    if (rawSkills.length === 0) {
      warnings.push("No explicit skills extracted from posting text.");
      score -= 10;
    }

    const finalScore = Math.max(0, Math.min(100, score));
    const isValid = errors.length === 0 && finalScore >= 50;

    return {
      recordId: record.externalId || record.id,
      qualityScore: finalScore,
      isValid,
      errors,
      warnings,
      missingFields,
      unresolvedSkills: rawSkills,
    };
  },
};
