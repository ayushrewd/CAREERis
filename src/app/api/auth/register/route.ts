import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { Prisma, UserRoleType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { hashPassword } from "@/server/auth/password";
import { createSessionToken, setSessionCookie } from "@/server/auth/session";
import { toAppRole, toPublicUser } from "@/server/auth/publicUser";
import { normalizeSkillName, resolveOrCreateSkill } from "@/server/services/skill/prismaSkillService";
import { operationalError } from "@/server/middleware/operationalError";

export const runtime = "nodejs";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
  phone: z.string().trim().max(24).optional(),
  roleType: z.enum(["CANDIDATE", "EMPLOYER", "TRAINING_PROVIDER", "DISTRICT_ADMIN"]).default("CANDIDATE"),
  headline: z.string().trim().max(160).optional(),
  district: z.string().trim().max(100).optional(),
  companyName: z.string().trim().max(160).optional(),
  designation: z.string().trim().max(100).optional(),
  industry: z.string().trim().max(120).optional(),
  cinNumber: z.string().trim().max(30).optional(),
  headquarters: z.string().trim().max(120).optional(),
  organizationName: z.string().trim().max(160).optional(),
  registrationNo: z.string().trim().max(60).optional(),
  providerType: z.string().trim().max(80).optional(),
  departmentName: z.string().trim().max(160).optional(),
  officialId: z.string().trim().max(80).optional(),
  location: z.string().trim().max(120).optional(),
  education: z.string().trim().max(160).optional(),
  qualification: z.string().trim().max(160).optional(),
  experience: z.string().trim().max(500).optional(),
  currentSkills: z.array(z.string().trim().min(1).max(80).refine(name => !!normalizeSkillName(name), 'Enter a valid skill name.')).max(30).default([]),
  targetRole: z.string().trim().max(160).optional(),
}).superRefine((data, ctx) => {
  const requiredField: [string, string | undefined] | null =
    data.roleType === "EMPLOYER" ? ["companyName", data.companyName] :
    data.roleType === "TRAINING_PROVIDER" ? ["organizationName", data.organizationName] :
    data.roleType === "DISTRICT_ADMIN" ? ["departmentName", data.departmentName] : null;
  if (requiredField && !requiredField[1]) {
    ctx.addIssue({ code: "custom", path: [requiredField[0]], message: "This field is required." });
  }
  if (data.roleType === "CANDIDATE") {
    for (const [field, value] of [
      ["location", data.location],
      ["education", data.education],
      ["qualification", data.qualification],
      ["experience", data.experience],
      ["targetRole", data.targetRole],
    ] as const) {
      if (!value) ctx.addIssue({ code: "custom", path: [field], message: "This field is required." });
    }
    if (data.currentSkills.length === 0) ctx.addIssue({ code: "custom", path: ["currentSkills"], message: "Add at least one current skill." });
  }
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the registration details." }, { status: 400 });
    }

    const data = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email: data.email }, select: { id: true } });
    if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

    const { user, session } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        passwordHash: hashPassword(data.password),
        roleType: data.roleType as UserRoleType,
        candidateProfile: data.roleType === "CANDIDATE" ? {
          create: {
            headline: data.headline || null,
            currentDistrict: data.location || data.district || null,
            location: data.location || null,
            educationSummary: data.education || null,
            qualification: data.qualification || null,
            experienceSummary: data.experience || null,
            targetRole: data.targetRole || null,
            preferredStates: [],
            declaredSkills: {
                create: Array.from(new Map(data.currentSkills.map((name) => [normalizeSkillName(name), name])).entries()).map(([normalizedName, name]) => ({
                name,
                normalizedName,
                verificationStatus: "UNVERIFIED",
              })),
            },
          },
        } : undefined,
        employerAccount: data.roleType === "EMPLOYER" ? {
          create: {
            companyName: data.companyName!,
            designation: data.designation || null,
            industry: data.industry || null,
            cinNumber: data.cinNumber || null,
            headquarters: data.headquarters || null,
            company: {
              create: {
                name: data.companyName!,
                legalName: data.companyName!,
                cinNumber: data.cinNumber || null,
                headquarters: data.headquarters || null,
                isVerified: false,
              },
            },
          },
        } : undefined,
        trainingProviderAccount: data.roleType === "TRAINING_PROVIDER" ? {
          create: {
            organizationName: data.organizationName!,
            registrationNo: data.registrationNo || null,
            providerType: data.providerType || null,
            headquarters: data.headquarters || null,
            trainingProvider: {
              create: {
                code: `TP-${randomUUID()}`,
                name: data.organizationName!,
                registrationNo: data.registrationNo || null,
                providerType: data.providerType || "UNSPECIFIED",
                headquarters: data.headquarters || null,
                isAccredited: false,
              },
            },
          },
        } : undefined,
        governmentPlannerProfile: data.roleType === "DISTRICT_ADMIN" ? {
          create: {
            departmentName: data.departmentName!,
            designation: data.designation || null,
            district: data.district || null,
            officialId: data.officialId || null,
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

    if (user.candidateProfile && data.currentSkills.length) {
        for (const rawName of new Map(data.currentSkills.map(name => [normalizeSkillName(name), name])).values()) {
          const skill = await resolveOrCreateSkill(rawName, tx);
          const normalizedName = normalizeSkillName(rawName);
          await tx.candidateDeclaredSkill.update({
            where: { candidateProfileId_normalizedName: { candidateProfileId: user.candidateProfile!.id, normalizedName } },
            data: { skillId: skill.id, name: skill.name },
          });
          await tx.candidateSkill.upsert({
            where: { candidateProfileId_skillId: { candidateProfileId: user.candidateProfile!.id, skillId: skill.id } },
            create: { candidateProfileId: user.candidateProfile!.id, skillId: skill.id },
            update: {},
          });
        }
        await tx.auditLog.create({ data: { userId: user.id, action: "ACCOUNT_REGISTER", entity: "User", entityId: user.id, newValue: { role: user.roleType } } });
    } else {
      await tx.auditLog.create({ data: { userId: user.id, action: "ACCOUNT_REGISTER", entity: "User", entityId: user.id, newValue: { role: user.roleType } } });
    }

    const session = createSessionToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      userRole: toAppRole(user.roleType),
    });
    await tx.session.create({
      data: {
        userId: user.id,
        token: session.databaseToken,
        userAgent: request.headers.get("user-agent"),
        expiresAt: new Date(session.payload.expiresAt),
      },
    });

    return { user, session };
    });
    const response = NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
    setSessionCookie(response, session.token);
    return response;
  } catch (error) {
    return operationalError(error, "Could not create the account. Please try again.");
  }
}
