import { DataSourceType, ProficiencyLevel } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { resolveAuthContext } from "@/server/middleware/authContext";
import { resolveOrCreateSkill } from "@/server/services/skill/prismaSkillService";

const evidenceTypes = ["EMPLOYER_SURVEYS", "INDUSTRY_CONSULTATION", "SECTOR_DATA", "TECHNOLOGY_TRENDS"] as const;
const schema = z.object({
  type: z.enum(evidenceTypes),
  title: z.string().trim().min(4).max(180),
  period: z.string().trim().min(3).max(40),
  location: z.string().trim().min(2).max(120),
  methodology: z.string().trim().min(10).max(1000),
  sourceUrl: z.string().url().nullable().optional(),
  observedAt: z.coerce.date(),
  skills: z.array(z.object({
    name: z.string().trim().min(1).max(100),
    quantity: z.coerce.number().int().min(0).max(1_000_000).default(0),
    proficiency: z.nativeEnum(ProficiencyLevel).nullable().optional(),
    description: z.string().trim().max(500).nullable().optional(),
  })).min(1).max(50),
}).superRefine((value, context) => {
  if (["TECHNOLOGY_TRENDS", "SECTOR_DATA"].includes(value.type) && !value.sourceUrl) {
    context.addIssue({ code: "custom", path: ["sourceUrl"], message: "A source URL is required for this evidence type." });
  }
  if (value.type !== "TECHNOLOGY_TRENDS" && value.skills.some((skill) => skill.quantity < 1)) {
    context.addIssue({ code: "custom", path: ["skills"], message: "Demand evidence requires a positive observed quantity." });
  }
});

async function companyFor(userId: string) {
  return prisma.employerAccountProfile.findUnique({ where: { userId }, select: { companyId: true, companyName: true } });
}

export async function GET(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole !== "EMPLOYER") return NextResponse.json({ error: "Company account required" }, { status: 403 });
    const sources = await prisma.dataSource.findMany({
      where: { submittedByUserId: auth.userId, sourceType: { in: [...evidenceTypes] } },
      orderBy: { collectionDate: "desc" },
      include: {
        demandSignals: { include: { skill: { select: { name: true } } } },
        technologySignals: { include: { skill: { select: { name: true } } } },
      },
    });
    return NextResponse.json({ sources });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load company evidence";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = resolveAuthContext(request);
    if (auth.userRole !== "EMPLOYER") return NextResponse.json({ error: "Company account required" }, { status: 403 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please check the evidence fields.", issues: parsed.error.flatten() }, { status: 400 });
    const company = await companyFor(auth.userId);
    if (!company?.companyId) return NextResponse.json({ error: "Company profile not found" }, { status: 404 });

    const source = await prisma.$transaction(async (tx) => {
      const created = await tx.dataSource.create({ data: {
        submittedByUserId: auth.userId,
        name: parsed.data.title,
        sourceType: parsed.data.type,
        collectionDate: parsed.data.observedAt,
        timePeriod: parsed.data.period,
        geographyScope: parsed.data.location,
        methodology: parsed.data.methodology,
        sourceUrl: parsed.data.sourceUrl || null,
        verificationStatus: parsed.data.sourceUrl ? "SOURCE_PROVIDED" : "REGISTERED_COMPANY_ATTESTED",
        version: "1",
      } });

      for (const item of parsed.data.skills) {
        const skill = await resolveOrCreateSkill(item.name, tx);
        if (parsed.data.type === "TECHNOLOGY_TRENDS") {
          await tx.technologySignal.create({ data: {
            dataSourceId: created.id,
            skillId: skill.id,
            title: parsed.data.title,
            description: item.description || null,
            sourceUrl: parsed.data.sourceUrl!,
            observedAt: parsed.data.observedAt,
            labourDemandValidated: false,
          } });
        } else {
          await tx.demandSignal.create({ data: {
            dataSourceId: created.id,
            skillId: skill.id,
            openPositions: item.quantity,
            proficiency: item.proficiency || null,
            recordedDate: parsed.data.observedAt,
            sourceEntity: parsed.data.type,
            sourceEntityId: company.companyId,
            provenance: { companyId: company.companyId, companyName: company.companyName, methodology: parsed.data.methodology },
          } });
        }
      }
      await tx.auditLog.create({ data: {
        userId: auth.userId,
        action: "INDUSTRY_EVIDENCE_SUBMIT",
        entity: "DataSource",
        entityId: created.id,
        newValue: { type: created.sourceType, skillCount: parsed.data.skills.length, location: created.geographyScope },
      } });
      return created;
    });
    return NextResponse.json({ source }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save company evidence";
    return NextResponse.json({ error: message }, { status: message === "Authentication required" ? 401 : 500 });
  }
}
