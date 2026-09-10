import { NextRequest, NextResponse } from "next/server";
import { getCandidateEvidence } from "@/server/candidate/evidence";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { calculateJobMatch } from "@/server/services/matching/jobMatchService";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    const profile = await prisma.candidateProfile.findUnique({ where: { userId: auth.userId } });
    if (!profile) return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
    const applications = await prisma.application.findMany({ where: { candidateProfileId: profile.id }, orderBy: { createdAt: "desc" }, include: { job: { include: { company: true } } } });
    return NextResponse.json({ applications });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load applications";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole !== "CANDIDATE") return NextResponse.json({ error: "Candidate account required" }, { status: 403 });
    const { jobId, coverNote } = await request.json();
    const job = await prisma.job.findFirst({ where: { id: jobId, status: "ACTIVE", company: { employerAccount: { isNot: null } } }, include: { declaredRequirements: true, jobSkills: { include: { skill: true } } } });
    if (!job) return NextResponse.json({ error: "Active registered-employer job not found" }, { status: 404 });
    const profile = await getCandidateEvidence(auth.userId);
    const match = await calculateJobMatch(auth.userId, job.id);
    const mandatoryRows = match.rows.filter((row) => row.mandatory);
    const checklist = {
      assessmentComplete: profile.declaredSkills.some((skill) => skill.assessmentPassed === true),
      requiredEvidence: mandatoryRows.length > 0 && mandatoryRows.every((row) => row.status !== "GAP"),
      profileComplete: !!(profile.location && profile.educationSummary && profile.qualification && profile.experienceSummary),
    };
    if (!Object.values(checklist).every(Boolean)) return NextResponse.json({ error: "Application prerequisites are incomplete.", checklist }, { status: 409 });
    const existing = await prisma.application.findFirst({ where: { jobId, candidateProfileId: profile.id } });
    if (existing) return NextResponse.json({ error: "You already applied for this job." }, { status: 409 });
    const application = await prisma.$transaction(async (tx) => {
      const created = await tx.application.create({ data: { jobId, candidateProfileId: profile.id, coverNote: typeof coverNote === "string" ? coverNote.trim() || null : null, matchScore: match.score, workflowStatus: "APPLIED", history: { create: { actorUserId: auth.userId, toStatus: "APPLIED" } } } });
      await tx.auditLog.create({ data: { userId: auth.userId, action: "APPLICATION_CREATE", entity: "Application", entityId: created.id, newValue: { jobId, matchScore: match.score } } });
      return created;
    });
    return NextResponse.json({ application, checklist }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not apply";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
