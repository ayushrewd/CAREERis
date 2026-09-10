import { ProficiencyLabel, SkillEvidenceConfidence, EvidenceBreakdown } from "@/types/skills";

export const DEFAULT_EVIDENCE_WEIGHTS: EvidenceBreakdown = {
  assessmentWeight: 0.40,
  certificationWeight: 0.25,
  employerWeight: 0.20,
  projectWeight: 0.10,
  selfReportWeight: 0.05,
};

export interface CandidateSkillEvidenceInput {
  skillId: string;
  skillName: string;
  claimedProficiency?: ProficiencyLabel;
  assessedScore?: number; // 0 - 100
  hasCertification?: boolean;
  certificationScore?: number; // 0 - 100
  employerEndorsementScore?: number; // 0 - 100
  projectScore?: number; // 0 - 100
  selfReportScore?: number; // 0 - 100
  verificationStatus?: string;
}

export const skillEvidenceScoringService = {
  weights: { ...DEFAULT_EVIDENCE_WEIGHTS },

  configureWeights(newWeights: Partial<EvidenceBreakdown>) {
    this.weights = { ...this.weights, ...newWeights };
  },

  calculateProficiencyFromScore(score: number): ProficiencyLabel {
    if (score >= 90) return "EXPERT";
    if (score >= 75) return "ADVANCED";
    if (score >= 60) return "INTERMEDIATE";
    if (score >= 40) return "FOUNDATIONAL";
    return "FOUNDATIONAL";
  },

  scoreCandidateSkill(input: CandidateSkillEvidenceInput): SkillEvidenceConfidence {
    const w = this.weights;

    // Normalize component contributions (0 - 100)
    const asmtScore = input.assessedScore !== undefined ? input.assessedScore : 0;
    const certScore = input.certificationScore !== undefined ? input.certificationScore : input.hasCertification ? 85 : 0;
    const empScore = input.employerEndorsementScore !== undefined ? input.employerEndorsementScore : 0;
    const projScore = input.projectScore !== undefined ? input.projectScore : 0;

    let selfScore = 50;
    if (input.claimedProficiency === "EXPERT") selfScore = 90;
    else if (input.claimedProficiency === "ADVANCED") selfScore = 75;
    else if (input.claimedProficiency === "INTERMEDIATE") selfScore = 60;
    else if (input.claimedProficiency === "FOUNDATIONAL") selfScore = 45;

    // Check active evidence channels
    let totalWeight = 0;
    let weightedSum = 0;

    if (input.assessedScore !== undefined) {
      weightedSum += asmtScore * w.assessmentWeight;
      totalWeight += w.assessmentWeight;
    }
    if (input.hasCertification || input.certificationScore !== undefined) {
      weightedSum += certScore * w.certificationWeight;
      totalWeight += w.certificationWeight;
    }
    if (input.employerEndorsementScore !== undefined) {
      weightedSum += empScore * w.employerWeight;
      totalWeight += w.employerWeight;
    }
    if (input.projectScore !== undefined) {
      weightedSum += projScore * w.projectWeight;
      totalWeight += w.projectWeight;
    }
    // Always include baseline self-report
    weightedSum += selfScore * w.selfReportWeight;
    totalWeight += w.selfReportWeight;

    const finalCalculatedScore = Math.round(weightedSum / Math.max(0.01, totalWeight));
    const calculatedProficiency = this.calculateProficiencyFromScore(finalCalculatedScore);

    // Calculate percentage share of evidence for explanation
    const asmtShare = input.assessedScore !== undefined ? Math.round((w.assessmentWeight / totalWeight) * 100) : 0;
    const certShare = (input.hasCertification || input.certificationScore) ? Math.round((w.certificationWeight / totalWeight) * 100) : 0;
    const empShare = input.employerEndorsementScore !== undefined ? Math.round((w.employerWeight / totalWeight) * 100) : 0;
    const projShare = input.projectScore !== undefined ? Math.round((w.projectWeight / totalWeight) * 100) : 0;
    const selfShare = Math.round((w.selfReportWeight / totalWeight) * 100);

    let confidenceRating: "HIGH" | "MEDIUM" | "LOW" = "LOW";
    let confidenceScore = 0.4;

    if (input.assessedScore !== undefined || input.employerEndorsementScore !== undefined) {
      confidenceRating = "HIGH";
      confidenceScore = 0.95;
    } else if (input.hasCertification || input.projectScore !== undefined) {
      confidenceRating = "MEDIUM";
      confidenceScore = 0.75;
    }

    const explanation = `Score: ${finalCalculatedScore}/100 (${calculatedProficiency}). Evidence confidence: ${confidenceRating} (${Math.round(confidenceScore * 100)}%) derived from: ${
      asmtShare > 0 ? `Proctored Assessment (${asmtShare}%), ` : ""
    }${certShare > 0 ? `Verified Certification (${certShare}%), ` : ""}${
      empShare > 0 ? `Employer Feedback (${empShare}%), ` : ""
    }${projShare > 0 ? `Hands-on Projects (${projShare}%), ` : ""}Self-declaration (${selfShare}%).`;

    return {
      skillId: input.skillId,
      skillName: input.skillName,
      calculatedProficiency,
      calculatedScore: finalCalculatedScore,
      confidenceRating,
      confidenceScore,
      evidenceShares: {
        assessmentPct: asmtShare,
        certificationPct: certShare,
        employerPct: empShare,
        projectPct: projShare,
        selfReportPct: selfShare,
      },
      explanation,
    };
  },
};
