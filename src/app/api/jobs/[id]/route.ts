import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { calculateJobMatch } from "@/server/services/matching/jobMatchService";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = resolveAuthContext(request);
    const job = await prisma.job.findFirst({
      where: { id: params.id, status: "ACTIVE", company: { employerAccount: { isNot: null } } },
      include: { company: true, declaredRequirements: true, jobSkills: { include: { skill: true } } },
    });
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    const requirements = [...job.declaredRequirements.map((item) => ({ name: item.name, normalizedName: item.normalizedName, proficiency: item.proficiency, mandatory: item.isMandatory })), ...job.jobSkills.map((item) => ({ name: item.skill.name, normalizedName: item.skill.normalizedName, proficiency: item.requiredLevel, mandatory: item.isMandatory }))];
    let match = null;
    if (auth.userRole === "CANDIDATE") {
      const calculated = await calculateJobMatch(auth.userId, job.id);
      match = { rows: calculated.rows, percentage: calculated.score, components: calculated.components, weights: calculated.weights, method: calculated.method, insufficientEvidence: calculated.insufficientEvidence };
    }
    return NextResponse.json({ job: { ...job, requirements }, match });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load job";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
