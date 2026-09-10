import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";
export { POST } from "@/app/api/candidate/applications/route";

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole === "CANDIDATE") {
      const profile = await prisma.candidateProfile.findUnique({ where: { userId: auth.userId } });
      if (!profile) return NextResponse.json({ applications: [] });
      const applications = await prisma.application.findMany({ where: { candidateProfileId: profile.id }, include: { job: { include: { company: true } }, history: { orderBy: { createdAt: "asc" } } }, orderBy: { createdAt: "desc" } });
      return NextResponse.json({ applications });
    }
    if (auth.userRole === "EMPLOYER") {
      const account = await prisma.employerAccountProfile.findUnique({ where: { userId: auth.userId } });
      if (!account?.companyId) return NextResponse.json({ applications: [] });
      const applications = await prisma.application.findMany({ where: { job: { companyId: account.companyId } }, include: { job: true, candidateProfile: { include: { user: { select: { fullName: true, email: true } } } }, history: { orderBy: { createdAt: "asc" } } }, orderBy: { createdAt: "desc" } });
      return NextResponse.json({ applications });
    }
    return NextResponse.json({ error: "Candidate or company account required" }, { status: 403 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load applications";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
