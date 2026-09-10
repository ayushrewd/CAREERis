import { NextRequest, NextResponse } from "next/server";
import { ProficiencyLevel } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { normalizeSkillName, resolveOrCreateSkill } from "@/server/services/skill/prismaSkillService";

const skillSchema = z.object({ name: z.string().trim().min(1).max(80), proficiency: z.nativeEnum(ProficiencyLevel).default(ProficiencyLevel.FOUNDATIONAL) });
const updateSchema = z.object({
  fullName: z.string().trim().min(2).max(100), location: z.string().trim().max(120).nullable().optional(),
  education: z.string().trim().max(200).nullable().optional(), qualification: z.string().trim().max(200).nullable().optional(),
  experience: z.string().trim().max(1000).nullable().optional(), targetRole: z.string().trim().max(180).nullable().optional(),
  headline: z.string().trim().max(160).nullable().optional(), skills: z.array(skillSchema).max(50),
});

async function loadProfile(userId: string) {
  return prisma.candidateProfile.findUnique({ where: { userId }, include: { user: { select: { fullName: true, email: true } }, declaredSkills: { orderBy: { name: "asc" }, include: { skill: true } } } });
}

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole !== "CANDIDATE") return NextResponse.json({ error: "Candidate account required" }, { status: 403 });
    const profile = await loadProfile(auth.userId);
    return profile ? NextResponse.json({ profile }) : NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load profile";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole !== "CANDIDATE") return NextResponse.json({ error: "Candidate account required" }, { status: 403 });
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please check the profile fields.", issues: parsed.error.flatten() }, { status: 400 });
    const current = await prisma.candidateProfile.findUnique({ where: { userId: auth.userId } });
    if (!current) return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
    const uniqueSkills = Array.from(new Map(parsed.data.skills.map((item) => [normalizeSkillName(item.name), item])).entries());
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: auth.userId }, data: { fullName: parsed.data.fullName } });
      await tx.candidateProfile.update({ where: { id: current.id }, data: {
        location: parsed.data.location || null, currentDistrict: parsed.data.location || null,
        educationSummary: parsed.data.education || null, qualification: parsed.data.qualification || null,
        experienceSummary: parsed.data.experience || null, targetRole: parsed.data.targetRole || null,
        headline: parsed.data.headline || null,
      } });
      await tx.candidateDeclaredSkill.deleteMany({ where: { candidateProfileId: current.id, normalizedName: { notIn: uniqueSkills.map(([name]) => name) } } });
      for (const [normalizedName, item] of uniqueSkills) {
        const skill = await resolveOrCreateSkill(item.name, tx);
        await tx.candidateDeclaredSkill.upsert({
          where: { candidateProfileId_normalizedName: { candidateProfileId: current.id, normalizedName } },
          create: { candidateProfileId: current.id, skillId: skill.id, name: skill.name, normalizedName: skill.normalizedName, claimedProficiency: item.proficiency },
          update: { skillId: skill.id, name: skill.name, claimedProficiency: item.proficiency },
        });
        await tx.candidateSkill.upsert({
          where: { candidateProfileId_skillId: { candidateProfileId: current.id, skillId: skill.id } },
          create: { candidateProfileId: current.id, skillId: skill.id, claimedProficiency: item.proficiency },
          update: { claimedProficiency: item.proficiency },
        });
      }
      await tx.auditLog.create({ data: { userId: auth.userId, action: "CANDIDATE_PROFILE_UPDATE", entity: "CandidateProfile", entityId: current.id, newValue: { skillCount: uniqueSkills.length } } });
    });
    return NextResponse.json({ profile: await loadProfile(auth.userId) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update profile";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
