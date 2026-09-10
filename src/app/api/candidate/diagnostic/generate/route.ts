import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { FreshQuestion, generateFreshDeclaredSkillQuestions } from "@/server/services/candidate/freshQuizGenerator";

export const runtime = "nodejs";

function outputText(response: any): string | null {
  for (const item of response?.output || []) {
    for (const content of item?.content || []) if (content?.type === "output_text" && content.text) return content.text;
  }
  return null;
}

async function generateWithAI(title: string, skills: string[], previousPrompts: string[]): Promise<FreshQuestion[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const count = skills.length;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_ASSESSMENT_MODEL || "gpt-4.1-mini",
      input: `Create exactly ${count} fresh, technically accurate multiple-choice diagnostic questions for "${title}". Assess every skill in this list exactly once: ${JSON.stringify(skills)}. The skill field must exactly match its list value. Do not reuse previous prompts: ${JSON.stringify(previousPrompts)}. Generation nonce: ${randomUUID()}. Each question needs 4 plausible options, one correctIndex from 0-3, and a concise explanation.`,
      text: {
        format: {
          type: "json_schema",
          name: "career_skill_diagnostic",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              questions: {
                type: "array", minItems: count, maxItems: count,
                items: {
                  type: "object", additionalProperties: false,
                  properties: {
                    id: { type: "string" }, skill: { type: "string" }, prompt: { type: "string" },
                    options: { type: "array", minItems: 4, maxItems: 4, items: { type: "string" } },
                    correctIndex: { type: "integer", minimum: 0, maximum: 3 }, explanation: { type: "string" },
                  },
                  required: ["id", "skill", "prompt", "options", "correctIndex", "explanation"],
                },
              },
            },
            required: ["questions"],
          },
        },
      },
    }),
  });
  if (!response.ok) {
    console.error("AI assessment generation failed", response.status, (await response.text()).slice(0, 500));
    return null;
  }
  const parsed = JSON.parse(outputText(await response.json()) || "{}") as { questions?: FreshQuestion[] };
  if (!Array.isArray(parsed.questions) || parsed.questions.length !== count) return null;

  const expected = new Set(skills.map((skill) => skill.toLowerCase()));
  const returned = new Set(parsed.questions.map((question) => question.skill.toLowerCase()));
  const previous = new Set(previousPrompts.map((prompt) => prompt.trim().toLowerCase()));
  const valid = returned.size === expected.size && [...expected].every((skill) => returned.has(skill)) && parsed.questions.every((question) =>
    expected.has(question.skill.toLowerCase()) && question.options.length === 4 &&
    Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex <= 3 &&
    !previous.has(question.prompt.trim().toLowerCase()),
  );
  return valid ? parsed.questions : null;
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const body = await request.json().catch(() => ({})) as { scope?: string };
    const declaredSkillsMode = body.scope === "DECLARED_SKILLS";
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: auth.userId },
      include: { declaredSkills: { orderBy: { createdAt: "asc" } } },
    });
    if (!profile) return NextResponse.json({ error: "Candidate profile not found." }, { status: 404 });

    let title = "Declared Skills Diagnostic";
    let scope: string[] = [];

    if (declaredSkillsMode) {
      scope = profile.declaredSkills.map((skill) => skill.name);
      if (scope.length === 0) return NextResponse.json({ error: "Declare at least one skill before starting an assessment." }, { status: 409 });
    } else {
      let targetJobId = profile.targetJobRoleId;
      if (!targetJobId && profile.targetRole) {
        const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
        const targetClean = clean(profile.targetRole);
        const candidates = await prisma.job.findMany({
          where: { status: "ACTIVE", company: { employerAccount: { isNot: null } } },
        });
        const found = candidates.find((j) => clean(j.title) === targetClean || targetClean.includes(clean(j.title)) || clean(j.title).includes(targetClean));
        if (found) {
          targetJobId = found.id;
          await prisma.candidateProfile.update({
            where: { id: profile.id },
            data: { targetJobRoleId: found.id, targetRole: found.title },
          });
        }
      }
      if (!targetJobId) return NextResponse.json({ error: "Select an evidence-backed target role first." }, { status: 409 });
      const selectedJob = await prisma.job.findFirst({
        where: { id: targetJobId, status: "ACTIVE", company: { employerAccount: { isNot: null } } },
        select: { title: true },
      });
      if (!selectedJob) return NextResponse.json({ error: "The selected role no longer has an active registered-employer record." }, { status: 409 });
      title = selectedJob.title;
      const evidenceJobs = await prisma.job.findMany({
        where: { status: "ACTIVE", title: { equals: title, mode: "insensitive" }, company: { employerAccount: { isNot: null } } },
        include: { declaredRequirements: true, jobSkills: { include: { skill: true } } },
      });
      const requiredSkills = Array.from(new Map(evidenceJobs.flatMap((job) => [
        ...job.declaredRequirements.map((item) => [item.normalizedName, item.name] as const),
        ...job.jobSkills.map((item) => [item.skill.normalizedName, item.skill.name] as const),
      ])).values());
      if (requiredSkills.length === 0) return NextResponse.json({ error: "Insufficient evidence to establish requirements or generate an assessment." }, { status: 409 });
      const declared = new Set(profile.declaredSkills.map((skill) => skill.normalizedName));
      const relevant = requiredSkills.filter((skill) => declared.has(skill.toLowerCase()));
      scope = Array.from(new Set([...relevant, ...requiredSkills])).slice(0, 10);
    }

    const previousAssessments = await prisma.diagnosticAssessment.findMany({
      where: { candidateProfileId: profile.id, targetRoleTitle: title },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { questions: true },
    });
    const previousPrompts = previousAssessments.flatMap((item) => {
      const questions = item.questions as unknown as FreshQuestion[];
      return Array.isArray(questions) ? questions.map((question) => question.prompt) : [];
    });

    const aiQuestions = await generateWithAI(title, scope, previousPrompts);
    const questions = aiQuestions || generateFreshDeclaredSkillQuestions(scope, previousPrompts);
    const assessment = await prisma.diagnosticAssessment.create({
      data: { candidateProfileId: profile.id, targetRoleTitle: title, questions },
    });
    return NextResponse.json({
      assessmentId: assessment.id,
      title: declaredSkillsMode ? "All Declared Skills — Fresh Assessment" : `${title} — Assessment`,
      engine: aiQuestions ? "AI_GENERATED" : "ADAPTIVE_LOCAL",
      coverage: { skills: scope.length, questions: questions.length },
      questions: questions.map(({ correctIndex: _answer, explanation: _explanation, ...question }) => question),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate assessment.";
    const status = message === "Authentication required" ? 401 : message.startsWith("No validated local assessment questions") ? 409 : 500;
    return NextResponse.json({ error: message, mode: process.env.OPENAI_API_KEY ? "AI_GENERATION_FAILED" : "LOCAL_QUESTION_BANK" }, { status });
  }
}
