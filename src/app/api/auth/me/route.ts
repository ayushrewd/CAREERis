import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { getRequestSession } from "@/server/auth/session";
import { toPublicUser } from "@/server/auth/publicUser";

export const runtime = "nodejs";

const updateSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(24).nullable().optional(),
  avatarUrl: z.string().max(2_000_000).nullable().optional(),
  headline: z.string().trim().max(160).nullable().optional(),
  district: z.string().trim().max(100).nullable().optional(),
});

async function findUser(request: NextRequest) {
  const session = getRequestSession(request);
  if (!session) return null;
  return prisma.user.findFirst({
    where: {
      id: session.userId,
      isActive: true,
      sessions: { some: { token: session.sessionId, expiresAt: { gt: new Date() } } },
    },
    include: {
      candidateProfile: { include: { declaredSkills: true } },
      employerAccount: { select: { companyName: true } },
      trainingProviderAccount: { select: { organizationName: true } },
      governmentPlannerProfile: { select: { departmentName: true } },
    },
  });
}

export async function GET(request: NextRequest) {
  const user = await findUser(request);
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: toPublicUser(user) });
}

export async function PATCH(request: NextRequest) {
  const session = getRequestSession(request);
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check the profile details." }, { status: 400 });

  const { headline, district, ...userData } = parsed.data;
  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...userData,
      candidateProfile: headline !== undefined || district !== undefined ? {
        upsert: {
          create: { headline, currentDistrict: district, preferredStates: [] },
          update: { headline, currentDistrict: district },
        },
      } : undefined,
    },
    include: {
      candidateProfile: { include: { declaredSkills: true } },
      employerAccount: { select: { companyName: true } },
      trainingProviderAccount: { select: { organizationName: true } },
      governmentPlannerProfile: { select: { departmentName: true } },
    },
  });
  return NextResponse.json({ user: toPublicUser(user) });
}
