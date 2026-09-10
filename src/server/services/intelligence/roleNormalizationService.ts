import { roleRepository } from "@/server/repositories/roleRepository";
import { unresolvedRoleRepository } from "@/server/repositories/unresolvedRoleRepository";
import { CanonicalRole } from "@/types/skills";

export interface RoleNormalizationResult {
  status: "RESOLVED" | "UNRESOLVED";
  rawTitle: string;
  canonicalRole?: CanonicalRole;
  confidence: number;
  matchedBy?: "EXACT_TITLE" | "CODE" | "ALIAS_KEYWORD";
}

const ROLE_ALIASES_MAP: Record<string, string> = {
  "bms calibration engineer": "role-bms-lead",
  "battery management system specialist": "role-bms-lead",
  "ev battery engineer": "role-bms-lead",
  "bms firmware developer": "role-bms-lead",
  "plc automation engineer": "role-auto-specialist",
  "scada programmer": "role-auto-specialist",
  "industry 4.0 automation specialist": "role-auto-specialist",
  "data analytics specialist": "role-data-analyst",
  "business data analyst": "role-data-analyst",
  "bi analyst": "role-data-analyst",
  "robotics motion engineer": "role-robotics-eng",
  "ros2 robotics software engineer": "role-robotics-eng",
  "cobot systems engineer": "role-robotics-eng",
};

export const roleNormalizationService = {
  async normalizeRole(rawTitle: string, context?: string): Promise<RoleNormalizationResult> {
    if (!rawTitle || !rawTitle.trim()) {
      return { status: "UNRESOLVED", rawTitle: rawTitle || "", confidence: 0 };
    }

    const clean = rawTitle
      .toLowerCase()
      .replace(/[^\w\s\(\)\-\.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // 1. Direct Alias Lookup
    if (ROLE_ALIASES_MAP[clean]) {
      const canonicalRoleId = ROLE_ALIASES_MAP[clean];
      const role = await roleRepository.findById(canonicalRoleId);
      if (role) {
        return {
          status: "RESOLVED",
          rawTitle,
          canonicalRole: role,
          confidence: 0.98,
          matchedBy: "ALIAS_KEYWORD",
        };
      }
    }

    // 2. Exact Title Match in Repository
    const allRoles = await roleRepository.findAll();
    for (const role of allRoles) {
      if (role.title.toLowerCase().trim() === clean) {
        return {
          status: "RESOLVED",
          rawTitle,
          canonicalRole: role,
          confidence: 1.0,
          matchedBy: "EXACT_TITLE",
        };
      }
    }

    // 3. Substring Containment Match
    for (const role of allRoles) {
      const roleClean = role.title.toLowerCase().trim();
      if (clean.includes(roleClean) || roleClean.includes(clean)) {
        return {
          status: "RESOLVED",
          rawTitle,
          canonicalRole: role,
          confidence: 0.85,
          matchedBy: "ALIAS_KEYWORD",
        };
      }
    }

    // 4. If Unresolved, Quarantine for Admin Review
    await unresolvedRoleRepository.create({
      rawTitle,
      normalizedTitle: clean,
      context: context || "Job Requisition Ingestion",
      sourceEntity: "JOB_MARKET",
      confidence: 0.0,
      status: "UNRESOLVED",
    });

    return {
      status: "UNRESOLVED",
      rawTitle,
      confidence: 0.0,
    };
  },
};
