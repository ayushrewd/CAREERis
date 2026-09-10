import { createHash } from "crypto";
import { Prisma, ProficiencyLevel, SkillType } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

const ALIASES: Record<string, string> = {
  "react js": "react",
  "react.js": "react",
  reactjs: "react",
  js: "javascript",
  ts: "typescript",
  aiml: "artificial intelligence and machine learning",
  "ai ml": "artificial intelligence and machine learning",
  ml: "machine learning",
  dl: "deep learning",
  genai: "generative ai",
  powerbi: "power bi",
  bms: "battery management systems",
  "can bus": "can communication",
  can: "can communication",
  cpp: "c++",
  nodejs: "node.js",
  nextjs: "next.js",
};

export function normalizeSkillName(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/[_/]+/g, " ").replace(/[^a-z0-9+#. ]/g, "").replace(/\s+/g, " ");
  return ALIASES[normalized] || normalized;
}

function displayName(value: string): string {
  return value.split(" ").map((part) => part.length <= 3 && /^[a-z]+$/.test(part) ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function skillCode(normalizedName: string): string {
  return `SK-${createHash("sha256").update(normalizedName).digest("hex").slice(0, 16).toUpperCase()}`;
}

export async function resolveOrCreateSkill(rawName: string, tx: Prisma.TransactionClient | typeof prisma = prisma) {
  const normalizedName = normalizeSkillName(rawName);
  if (!normalizedName) throw new Error("Skill name is required");
  const existing = await tx.skill.findFirst({
    where: { OR: [{ normalizedName }, { aliases: { some: { normalizedAlias: normalizedName, status: "ACTIVE" } } }] },
  });
  if (existing) {
    if (normalizeSkillName(rawName) !== normalizeSkillName(existing.name)) {
      await tx.skillAlias.upsert({
        where: { id: `${existing.id}:${createHash("sha1").update(rawName.toLowerCase()).digest("hex").slice(0, 12)}` },
        create: { id: `${existing.id}:${createHash("sha1").update(rawName.toLowerCase()).digest("hex").slice(0, 12)}`, skillId: existing.id, alias: rawName.trim(), normalizedAlias: normalizeSkillName(rawName), source: "USER_INPUT" },
        update: {},
      });
    }
    return existing;
  }
  const category = await tx.skillCategory.upsert({
    where: { code: "USER-DEFINED" },
    create: { code: "USER-DEFINED", name: "User and Industry Defined Skills" },
    update: {},
  });
  return tx.skill.create({
    data: {
      categoryId: category.id,
      code: skillCode(normalizedName),
      name: rawName.trim() || displayName(normalizedName),
      canonicalName: displayName(normalizedName),
      normalizedName,
      skillType: SkillType.TECHNICAL,
      status: "ACTIVE",
      aliases: rawName.trim().toLowerCase() !== normalizedName ? { create: { alias: rawName.trim(), normalizedAlias: normalizeSkillName(rawName), source: "USER_INPUT" } } : undefined,
    },
  });
}

export const proficiencyRank: Record<ProficiencyLevel, number> = {
  FOUNDATIONAL: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
  MASTER: 5,
};

export function scoreToProficiency(score: number | null): ProficiencyLevel | null {
  if (score === null) return null;
  if (score >= 90) return ProficiencyLevel.EXPERT;
  if (score >= 75) return ProficiencyLevel.ADVANCED;
  if (score >= 60) return ProficiencyLevel.INTERMEDIATE;
  return ProficiencyLevel.FOUNDATIONAL;
}
