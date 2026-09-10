import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";

const updateSchema = z.object({
  companyName: z.string().trim().min(2).max(160),
  designation: z.string().trim().max(100).nullable().optional(),
  industry: z.string().trim().max(120).nullable().optional(),
  cinNumber: z.string().trim().max(30).nullable().optional(),
  headquarters: z.string().trim().max(160).nullable().optional(),
  website: z.string().trim().url().max(300).nullable().optional().or(z.literal("")),
  description: z.string().trim().max(2000).nullable().optional(),
});

async function loadProfile(userId: string) {
  const account = await prisma.employerAccountProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { fullName: true, email: true, phone: true } },
      company: { include: { _count: { select: { jobs: true } } } },
    },
  });
  if (!account) return null;
  return {
    id: account.id,
    companyName: account.companyName,
    designation: account.designation,
    industry: account.industry,
    cinNumber: account.cinNumber,
    headquarters: account.headquarters,
    website: account.website,
    canPostJobs: account.canPostJobs,
    contact: account.user,
    company: account.company ? {
      id: account.company.id,
      legalName: account.company.legalName,
      description: account.company.description,
      logoUrl: account.company.logoUrl,
      isVerified: account.company.isVerified,
      jobsPublished: account.company._count.jobs,
      createdAt: account.company.createdAt,
    } : null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole !== "EMPLOYER") return NextResponse.json({ error: "Company account required." }, { status: 403 });
    const profile = await loadProfile(auth.userId);
    if (!profile) return NextResponse.json({ error: "Company profile not found." }, { status: 404 });
    return NextResponse.json({ profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load company profile.";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole !== "EMPLOYER") return NextResponse.json({ error: "Company account required." }, { status: 403 });
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please check the company details." }, { status: 400 });
    const current = await prisma.employerAccountProfile.findUnique({ where: { userId: auth.userId }, select: { companyId: true } });
    if (!current?.companyId) return NextResponse.json({ error: "Company record is not linked to this account." }, { status: 409 });
    const data = parsed.data;
    await prisma.$transaction([
      prisma.employerAccountProfile.update({
        where: { userId: auth.userId },
        data: { companyName: data.companyName, designation: data.designation || null, industry: data.industry || null, cinNumber: data.cinNumber || null, headquarters: data.headquarters || null, website: data.website || null },
      }),
      prisma.company.update({
        where: { id: current.companyId },
        data: { name: data.companyName, legalName: data.companyName, cinNumber: data.cinNumber || null, headquarters: data.headquarters || null, website: data.website || null, description: data.description || null },
      }),
    ]);
    return NextResponse.json({ profile: await loadProfile(auth.userId) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update company profile.";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
