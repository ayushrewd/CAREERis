import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = resolveAuthContext(request);
    const application = await prisma.application.findUnique({ where: { id: params.id }, include: { job: { include: { company: { include: { employerAccount: true } } } }, candidateProfile: true, history: { orderBy: { createdAt: "asc" } }, interviews: true, offer: true, placement: true } });
    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });
    const isCandidateOwner = auth.userRole === "CANDIDATE" && application.candidateProfile.userId === auth.userId;
    const isCompanyOwner = auth.userRole === "EMPLOYER" && application.job.company.employerAccount?.userId === auth.userId;
    if (!isCandidateOwner && !isCompanyOwner) return NextResponse.json({ error: "Access denied" }, { status: 403 });
    return NextResponse.json({ application });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load application";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}

export async function PATCH() {
  return NextResponse.json({ error: "Use the company-owned hiring pipeline endpoint to change an application status." }, { status: 405 });
}
