import { NextRequest, NextResponse } from "next/server";
import { getCandidateEvidence, getTargetRoleEvidence, hasProjectEvidence } from "@/server/candidate/evidence";
import { resolveAuthContext } from "@/server/middleware/authContext";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const profile = await getCandidateEvidence(auth.userId);
    const role = await getTargetRoleEvidence(profile.targetJobRoleId);
    if (!role || role.requirements.length === 0) return NextResponse.json({ role: null, rows: [], gaps: [], insufficientEvidence: true });
    const skills = new Map(profile.declaredSkills.map((skill) => [skill.normalizedName, skill]));
    const rows = role.requirements.map((requirement) => {
      const candidateSkill = skills.get(requirement.normalizedName);
      const assessment = candidateSkill?.assessmentPassed === true;
      const project = candidateSkill ? hasProjectEvidence(candidateSkill) : false;
      const evidenced = assessment || project;
      return {
        skill: requirement.name, normalizedName: requirement.normalizedName, candidate: evidenced,
        declared: !!candidateSkill, assessment, assessedScore: candidateSkill?.assessedScore ?? null,
        project, proficiency: requirement.proficiency, evidenceCount: requirement.evidence.length,
        reason: evidenced ? `Candidate has ${assessment && project ? "a passing assessment and verified project" : assessment ? "a passing assessment" : "verified project evidence"}.`
          : `Required by ${requirement.evidence.length} registered-employer posting(s); candidate has no passing assessment or verified project evidence.`,
      };
    });
    const evidencedCount = rows.filter((row) => row.candidate).length;
    return NextResponse.json({
      role: { id: role.id, title: role.title, evidenceRecords: role.jobsCount }, rows,
      gaps: rows.filter((row) => !row.candidate).map((row, index) => ({ priority: index + 1, ...row })),
      evidencedCount, requiredCount: rows.length,
      matchPercentage: Math.round((evidencedCount / rows.length) * 100),
      method: `${evidencedCount} / ${rows.length} required skills evidenced`, insufficientEvidence: false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not calculate skill gaps";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
