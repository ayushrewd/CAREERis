import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";

const schema = z.object({ status: z.enum(["VERIFIED", "REJECTED"]), reason: z.string().trim().min(3).max(500) });

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole !== "EMPLOYER") return NextResponse.json({ error: "Company account required" }, { status: 403 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Status and a verification reason are required." }, { status: 400 });
    const account = await prisma.employerAccountProfile.findUnique({ where: { userId: auth.userId } });
    if (!account?.companyId) return NextResponse.json({ error: "Company profile not found" }, { status: 404 });
    const project = await prisma.project.findFirst({
      where: { id: params.id, candidateProfile: { applications: { some: { job: { companyId: account.companyId } } } } },
      include: { declaredSkillEvidence: true },
    });
    if (!project) return NextResponse.json({ error: "Project is not attached to an applicant for your company." }, { status: 404 });
    if (!project.repositoryReachable && parsed.data.status === "VERIFIED") return NextResponse.json({ error: "An unreachable repository cannot be verified." }, { status: 409 });
    const updated = await prisma.$transaction(async (tx) => {
      const record = await tx.project.update({ where: { id: project.id }, data: { verificationStatus: parsed.data.status, verificationMethod: "EMPLOYER_REVIEW", verificationReason: parsed.data.reason, verifiedAt: new Date() } });
      await tx.skillProjectEvidence.updateMany({ where: { projectId: project.id }, data: { status: parsed.data.status } });
      await tx.auditLog.create({ data: { userId: auth.userId, action: "PROJECT_EVIDENCE_VERIFY", entity: "Project", entityId: project.id, newValue: parsed.data } });
      return record;
    });
    return NextResponse.json({ project: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not verify project";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
