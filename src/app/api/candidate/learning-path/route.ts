import { NextRequest, NextResponse } from "next/server";
import { getCandidateEvidence, getTargetRoleEvidence, hasProjectEvidence } from "@/server/candidate/evidence";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const profile = await getCandidateEvidence(auth.userId);
    const role = await getTargetRoleEvidence(profile.targetJobRoleId);
    if (!role) return NextResponse.json({ role: null, paths: [], insufficientEvidence: true });
    const skills = new Map(profile.declaredSkills.map((skill) => [skill.normalizedName, skill]));
    const gaps = role.requirements.filter((requirement) => {
      const skill = skills.get(requirement.normalizedName);
      return !skill || (!skill.assessedAt && !hasProjectEvidence(skill));
    });
    const canonical = await prisma.skill.findMany({ where: { normalizedName: { in: gaps.map((gap) => gap.normalizedName) } } });
    const skillIdByName = new Map(canonical.map((skill) => [skill.normalizedName, skill.id]));
    const courseSkills = canonical.length ? await prisma.courseSkill.findMany({
      where: { skillId: { in: canonical.map((skill) => skill.id) }, course: { status: "ACTIVE", trainingProvider: { account: { isNot: null } } } },
      include: { skill: true, course: { include: { trainingProvider: true } } },
    }) : [];
    const paths = gaps.map((gap) => ({
      skill: gap.name, proficiency: gap.proficiency, qualification: profile.qualification, evidenceRecords: gap.evidence.length,
      courses: courseSkills.filter((entry) => entry.skillId === skillIdByName.get(gap.normalizedName)).map((entry) => ({
        id: entry.course.id, title: entry.course.title, provider: entry.course.trainingProvider.name,
        level: entry.course.level, durationHours: entry.course.durationHours, deliveryMode: entry.course.deliveryMode,
        location: entry.course.locationText, eligibility: entry.course.eligibility, sourceUrl: entry.course.sourceUrl,
        enrollmentUrl: entry.course.enrollmentUrl, evidence: entry.course.evidenceNote || "Registered training-provider course record",
      })),
    }));
    return NextResponse.json({ role: { title: role.title }, paths, insufficientEvidence: role.requirements.length === 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not build learning path";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
