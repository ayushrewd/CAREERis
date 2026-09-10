import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { resolveOrCreateSkill } from "@/server/services/skill/prismaSkillService";

export const runtime = "nodejs";

type StoredQuestion = { id: string; skill: string; prompt: string; options: string[]; correctIndex: number; explanation: string };

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json();
    if (typeof body.assessmentId !== "string" || !Array.isArray(body.answers)) return NextResponse.json({ error: "Invalid assessment submission." }, { status: 400 });
    const assessment = await prisma.diagnosticAssessment.findFirst({
      where: { id: body.assessmentId, status: "IN_PROGRESS", candidateProfile: { userId: auth.userId } },
      include: { candidateProfile: true },
    });
    if (!assessment) return NextResponse.json({ error: "Assessment not found or already submitted." }, { status: 404 });
    const questions = assessment.questions as unknown as StoredQuestion[];
    if (body.answers.length !== questions.length || body.answers.some((answer: unknown) => !Number.isInteger(answer) || Number(answer) < 0 || Number(answer) > 3)) return NextResponse.json({ error: "Answer every question before submitting." }, { status: 400 });

    const buckets = new Map<string, { skill: string; correct: number; total: number }>();
    questions.forEach((question, index) => {
      const key = question.skill.toLowerCase();
      const bucket = buckets.get(key) || { skill: question.skill, correct: 0, total: 0 };
      bucket.total += 1;
      if (body.answers[index] === question.correctIndex) bucket.correct += 1;
      buckets.set(key, bucket);
    });
    const passThreshold = Math.max(1, Math.min(100, Number(process.env.ASSESSMENT_PASS_THRESHOLD || 70)));
    const results = Array.from(buckets.entries()).map(([normalizedName, value]) => ({
      ...value,
      normalizedName,
      percentage: Math.round((value.correct / value.total) * 100),
      passThreshold,
      passed: Math.round((value.correct / value.total) * 100) >= passThreshold,
      status: Math.round((value.correct / value.total) * 100) >= passThreshold ? "PASSED" : "FAILED",
    }));
    await prisma.$transaction(async (tx) => {
      await tx.diagnosticAssessment.update({
        where: { id: assessment.id },
        data: { answers: body.answers, results, status: "COMPLETED", completedAt: new Date() },
      });
      for (const result of results) {
        const skill = await resolveOrCreateSkill(result.skill, tx);
        await tx.candidateDeclaredSkill.upsert({
          where: { candidateProfileId_normalizedName: { candidateProfileId: assessment.candidateProfileId, normalizedName: skill.normalizedName } },
          create: { candidateProfileId: assessment.candidateProfileId, skillId: skill.id, name: skill.name, normalizedName: skill.normalizedName, verificationStatus: result.status, assessedScore: result.percentage, assessmentPassed: result.passed, passThreshold, assessedAt: new Date() },
          update: { skillId: skill.id, verificationStatus: result.status, assessedScore: result.percentage, assessmentPassed: result.passed, passThreshold, assessedAt: new Date() },
        });
        const candidateSkill = await tx.candidateSkill.upsert({
          where: { candidateProfileId_skillId: { candidateProfileId: assessment.candidateProfileId, skillId: skill.id } },
          create: { candidateProfileId: assessment.candidateProfileId, skillId: skill.id, assessedScore: result.percentage, verificationStatus: result.passed ? "ASSESSMENT_VERIFIED" : "UNVERIFIED", verifiedAt: result.passed ? new Date() : null },
          update: { assessedScore: result.percentage, verificationStatus: result.passed ? "ASSESSMENT_VERIFIED" : "UNVERIFIED", verifiedAt: result.passed ? new Date() : null },
        });
        await tx.skillEvidence.create({ data: { candidateSkillId: candidateSkill.id, evidenceType: "ASSESSMENT_REPORT", title: `${result.skill} diagnostic`, description: `${result.percentage}% (${result.status}); threshold ${passThreshold}%`, status: result.passed ? "ASSESSMENT_VERIFIED" : "SELF_ATTESTED" } });
      }
      await tx.auditLog.create({ data: { userId: auth.userId, action: "ASSESSMENT_COMPLETE", entity: "DiagnosticAssessment", entityId: assessment.id, newValue: { results } } });
    });

    const weak = results.filter((result) => result.percentage < 70);
    const weakNames = weak.map((result) => result.normalizedName);
    const courses = weakNames.length ? await prisma.courseSkill.findMany({
      where: {
        skill: { normalizedName: { in: weakNames } },
        course: { status: "ACTIVE", trainingProvider: { account: { isNot: null } } },
      },
      include: { skill: true, course: { include: { trainingProvider: true } } },
      take: 12,
    }) : [];
    const recommendations = courses.map((item) => ({
      skill: item.skill.name,
      title: item.course.title,
      provider: item.course.trainingProvider.name,
      durationHours: item.course.durationHours,
      source: "CAREERIS training-provider course record",
      actionUrl: `/courses/${item.course.id}`,
    }));
    if (weak.some((item) => /(^|\s)(ai|ml)(\s|$)|machine learning|agentic|ai agent/i.test(item.skill)) || /ai|machine learning|agentic|ai agent/i.test(assessment.targetRoleTitle)) {
      recommendations.push({
        skill: "AI / ML / Agentic AI",
        title: "THE GOATY NOTES — AI/ML, Agentic AI & AI Agents",
        provider: "THE GOATY NOTES",
        durationHours: 0,
        source: "User-supplied external learning resource",
        actionUrl: "https://www.thegoatynotes.workers.dev",
      });
    }
    return NextResponse.json({ results, weakSkills: weak, recommendations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not score assessment.";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
