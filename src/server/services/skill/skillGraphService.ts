import { skillGraphRepository } from "@/server/repositories/skillGraphRepository";
import { roleRepository } from "@/server/repositories/roleRepository";
import { jobRepository } from "@/server/repositories/jobRepository";
import { courseRepository } from "@/server/repositories/courseRepository";
import { assessmentRepository } from "@/server/repositories/assessmentRepository";
import { CanonicalSkill, SkillRelationship } from "@/types/skills";

export interface GraphNode {
  id: string;
  name: string;
  category: string;
  skillType: string;
  isEmerging: boolean;
  isGreenSkill: boolean;
  metrics: {
    rolesCount: number;
    jobsCount: number;
    coursesCount: number;
    assessmentsCount: number;
    relatedSkillsCount: number;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationType: string;
  weight: number;
  confidence: number;
}

export interface SkillGraphData {
  rootSkillId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  prerequisites: Array<{ id: string; name: string; weight: number }>;
  complementary: Array<{ id: string; name: string; weight: number }>;
  related: Array<{ id: string; name: string; weight: number }>;
  coOccursWith: Array<{ id: string; name: string; weight: number }>;
  connectedRoles: Array<{ id: string; title: string; isMandatory: boolean }>;
  connectedJobs: Array<{ id: string; title: string; companyName: string; district: string }>;
  connectedCourses: Array<{ id: string; title: string; providerName: string }>;
  connectedAssessments: Array<{ id: string; title: string; passingScore: number }>;
}

export const skillGraphService = {
  async getSkillGraph(skillId: string, depth = 1): Promise<SkillGraphData> {
    const rootSkill = await skillGraphRepository.findById(skillId);
    if (!rootSkill) {
      throw new Error(`Skill not found: ${skillId}`);
    }

    const nodesMap = new Map<string, GraphNode>();
    const edges: GraphEdge[] = [];

    // Helper to register node
    const registerNode = async (skill: CanonicalSkill) => {
      if (nodesMap.has(skill.id)) return;
      const roles = await roleRepository.findRolesBySkillId(skill.id);
      const jobs = await jobRepository.findAll({ skillId: skill.id, pageSize: 5 });
      const courses = await courseRepository.findAll({ search: skill.name });
      const assessments = await assessmentRepository.findBySkillId(skill.id);

      nodesMap.set(skill.id, {
        id: skill.id,
        name: skill.name,
        category: skill.categoryName,
        skillType: skill.skillType,
        isEmerging: skill.isEmerging,
        isGreenSkill: skill.isGreenSkill,
        metrics: {
          rolesCount: roles.length,
          jobsCount: jobs.total,
          coursesCount: courses.items.length,
          assessmentsCount: assessments.length,
          relatedSkillsCount: skill.outgoingRelations.length + skill.incomingRelations.length,
        },
      });
    };

    await registerNode(rootSkill);

    const prerequisites: Array<{ id: string; name: string; weight: number }> = [];
    const complementary: Array<{ id: string; name: string; weight: number }> = [];
    const related: Array<{ id: string; name: string; weight: number }> = [];
    const coOccursWith: Array<{ id: string; name: string; weight: number }> = [];

    // Traverse outgoing relations
    for (const rel of rootSkill.outgoingRelations) {
      const targetSkill = await skillGraphRepository.findById(rel.targetSkillId);
      if (targetSkill) {
        await registerNode(targetSkill);
        edges.push({
          id: rel.id,
          source: rootSkill.id,
          target: targetSkill.id,
          relationType: rel.relationType,
          weight: rel.weight,
          confidence: rel.confidence,
        });

        if (rel.relationType === "PREREQUISITE") {
          prerequisites.push({ id: targetSkill.id, name: targetSkill.name, weight: rel.weight });
        } else if (rel.relationType === "COMPLEMENTARY") {
          complementary.push({ id: targetSkill.id, name: targetSkill.name, weight: rel.weight });
        } else if (rel.relationType === "CO_OCCURS_WITH") {
          coOccursWith.push({ id: targetSkill.id, name: targetSkill.name, weight: rel.weight });
        } else {
          related.push({ id: targetSkill.id, name: targetSkill.name, weight: rel.weight });
        }
      }
    }

    // Traverse incoming relations (where other skills depend on root skill)
    for (const rel of rootSkill.incomingRelations) {
      const sourceSkill = await skillGraphRepository.findById(rel.sourceSkillId);
      if (sourceSkill) {
        await registerNode(sourceSkill);
        edges.push({
          id: rel.id,
          source: sourceSkill.id,
          target: rootSkill.id,
          relationType: rel.relationType,
          weight: rel.weight,
          confidence: rel.confidence,
        });
      }
    }

    // Connected entities
    const roles = await roleRepository.findRolesBySkillId(rootSkill.id);
    const connectedRoles = roles.map((r) => ({
      id: r.id,
      title: r.title,
      isMandatory: r.coreSkills.some((s) => s.skillId === rootSkill.id),
    }));

    const jobsRes = await jobRepository.findAll({ skillId: rootSkill.id, pageSize: 6 });
    const connectedJobs = jobsRes.items.map((j) => ({
      id: j.id,
      title: j.title,
      companyName: j.companyName,
      district: j.district,
    }));

    const coursesRes = await courseRepository.findAll({ search: rootSkill.name });
    const connectedCourses = coursesRes.items.map((c) => ({
      id: c.id,
      title: c.title,
      providerName: c.trainingProviderName,
    }));

    const assessments = await assessmentRepository.findBySkillId(rootSkill.id);
    const connectedAssessments = assessments.map((a) => ({
      id: a.id,
      title: a.title,
      passingScore: a.passingScore,
    }));

    return {
      rootSkillId: rootSkill.id,
      nodes: Array.from(nodesMap.values()),
      edges,
      prerequisites,
      complementary,
      related,
      coOccursWith,
      connectedRoles,
      connectedJobs,
      connectedCourses,
      connectedAssessments,
    };
  },
};
