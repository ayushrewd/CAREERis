import { AssessmentDefinition, AssessmentAttemptRecord, INITIAL_ASSESSMENTS } from "@/lib/store/platformStore";

let inMemoryAssessments: AssessmentDefinition[] = [...INITIAL_ASSESSMENTS];
let inMemoryAttempts: AssessmentAttemptRecord[] = [];

export const assessmentRepository = {
  async findAll(): Promise<AssessmentDefinition[]> {
    return [...inMemoryAssessments];
  },

  async findById(id: string): Promise<AssessmentDefinition | null> {
    const asmt = inMemoryAssessments.find((a) => a.id === id);
    return asmt || null;
  },

  async findBySkillId(skillId: string): Promise<AssessmentDefinition[]> {
    return inMemoryAssessments.filter(
      (a) => a.skillId === skillId || a.skillName?.toLowerCase().includes(skillId.toLowerCase())
    );
  },

  async saveAttempt(attempt: Omit<AssessmentAttemptRecord, "id" | "completedAt">): Promise<AssessmentAttemptRecord> {
    const newAttempt: AssessmentAttemptRecord = {
      ...attempt,
      id: `att-${Date.now().toString(36)}`,
      completedAt: new Date().toISOString(),
    };
    inMemoryAttempts = [newAttempt, ...inMemoryAttempts];
    return newAttempt;
  },

  async findAttemptsByCandidate(candidateId: string): Promise<AssessmentAttemptRecord[]> {
    return inMemoryAttempts.filter((a) => a.candidateId === candidateId);
  },
};
