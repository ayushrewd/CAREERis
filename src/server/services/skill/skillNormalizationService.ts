import { CanonicalSkill, NormalizationResult, ISkillResolver } from "@/types/skills";
import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { unresolvedSkillRepository } from "@/server/repositories/unresolvedSkillRepository";
import { embeddingRepository, getSemanticMatchingMode } from "@/server/repositories/embeddingRepository";

// Known Indian & International industry abbreviations dictionary
const KNOWN_ABBREVIATIONS: Record<string, string> = {
  bms: "Battery Management Systems (BMS)",
  plc: "Programmable Logic Controllers (PLC)",
  scada: "SCADA Systems",
  ros: "Industrial Robotics (ROS 2)",
  "ros 2": "Industrial Robotics (ROS 2)",
  ros2: "Industrial Robotics (ROS 2)",
  can: "CAN Bus Communication",
  "can-fd": "CAN Bus Communication",
  canfd: "CAN Bus Communication",
  cnc: "CNC Multi-Axis Machining",
  vmc: "CNC Multi-Axis Machining",
  ml: "Machine Learning",
  ai: "Machine Learning",
  pbi: "Power BI",
  powerbi: "Power BI",
  "react js": "React",
  reactjs: "React",
  "react.js": "React",
  py: "Python",
  py3: "Python",
  "python 3": "Python",
  "python programming": "Python",
  "python developer": "Python",
  "python scripting": "Python",
  "sql queries": "SQL",
  "structured query language": "SQL",
};

export class DeterministicSkillResolver implements ISkillResolver {
  async resolve(rawText: string, context?: string): Promise<NormalizationResult> {
    if (!rawText || !rawText.trim()) {
      return {
        status: "UNRESOLVED",
        rawInput: rawText || "",
        normalizedInput: "",
        confidence: 0,
      };
    }

    const raw = rawText.trim();
    // 1. Lowercase, strip punctuation and extra whitespace
    const normalized = raw
      .toLowerCase()
      .replace(/[^\w\s\(\)\-\.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // 2. Check direct exact canonical match
    const exactSkill = await skillGraphRepository.findByNormalizedName(normalized);
    if (exactSkill) {
      return {
        status: "RESOLVED",
        rawInput: raw,
        normalizedInput: normalized,
        canonicalSkill: exactSkill,
        matchedBy: "EXACT_CANONICAL",
        confidence: 1.0,
      };
    }

    // 3. Check known abbreviations dictionary
    if (KNOWN_ABBREVIATIONS[normalized]) {
      const targetName = KNOWN_ABBREVIATIONS[normalized];
      const targetSkill = await skillGraphRepository.findByNormalizedName(targetName.toLowerCase());
      if (targetSkill) {
        return {
          status: "RESOLVED",
          rawInput: raw,
          normalizedInput: normalized,
          canonicalSkill: targetSkill,
          matchedBy: "ABBREVIATION",
          confidence: 0.98,
        };
      }
    }

    // 4. Check alias repository
    const aliasMatch = await skillGraphRepository.findByAlias(normalized);
    if (aliasMatch) {
      return {
        status: "RESOLVED",
        rawInput: raw,
        normalizedInput: normalized,
        canonicalSkill: aliasMatch.skill,
        matchedBy: "ALIAS",
        confidence: aliasMatch.alias.confidence || 0.95,
      };
    }

    // 5. Fuzzy match on canonical skills
    const allSkillsRes = await skillGraphRepository.findAll({ pageSize: 100 });
    for (const skill of allSkillsRes.items) {
      if (normalized.includes(skill.normalizedName) || skill.normalizedName.includes(normalized)) {
        return {
          status: "RESOLVED",
          rawInput: raw,
          normalizedInput: normalized,
          canonicalSkill: skill,
          matchedBy: "NORMALIZED_NAME",
          confidence: 0.85,
        };
      }
    }

    // 6. Check Semantic Embedding Resolver in Shadow Mode if configured
    const semanticMode = getSemanticMatchingMode();
    if (semanticMode === "active" || semanticMode === "shadow") {
      try {
        const queryVector = await embeddingRepository.provider.embedText(normalized);
        const nearest = await embeddingRepository.findNearestSkills(queryVector, 1);
        if (nearest.length > 0 && nearest[0].similarity > 0.82) {
          const matchedSkill = await skillGraphRepository.findById(nearest[0].skillId);
          if (matchedSkill) {
            if (semanticMode === "shadow") {
              console.log(`[Semantic Shadow Mode] Raw: "${raw}" -> Matched: "${matchedSkill.name}" (sim: ${nearest[0].similarity.toFixed(2)})`);
            } else {
              return {
                status: "RESOLVED",
                rawInput: raw,
                normalizedInput: normalized,
                canonicalSkill: matchedSkill,
                matchedBy: "EMBEDDING_SEMANTIC",
                confidence: nearest[0].similarity,
              };
            }
          }
        }
      } catch (err) {
        // Fall through safely
      }
    }

    // 7. If still unresolved, quarantine to UnresolvedSkill store for admin governance
    await unresolvedSkillRepository.create({
      rawText: raw,
      normalizedText: normalized,
      context: context || "Candidate/Employer Input",
      sourceEntity: "MANUAL",
      confidence: 0.0,
      status: "UNRESOLVED",
    });

    return {
      status: "UNRESOLVED",
      rawInput: raw,
      normalizedInput: normalized,
      confidence: 0.0,
    };
  }
}

export const skillNormalizationService = {
  resolver: new DeterministicSkillResolver() as ISkillResolver,

  async normalizeSkill(rawText: string, context?: string): Promise<NormalizationResult> {
    return this.resolver.resolve(rawText, context);
  },

  async batchNormalize(rawTexts: string[], context?: string): Promise<NormalizationResult[]> {
    return Promise.all(rawTexts.map((t) => this.normalizeSkill(t, context)));
  },
};
