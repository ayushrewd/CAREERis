// ==============================================================================
// CAREERIS TRAINING OPERATIONS REPOSITORY
// Courses, Curriculums, Batches, Enrollments, Question Banks, Attempts & Training Demands
// ==============================================================================

import {
  CourseDetailRecord,
  CurriculumVersionRecord,
  BatchRecord,
  LearnerEnrollmentRecord,
  AssessmentQuestionItem,
  AssessmentAttemptRecord,
  TrainingDemandRequestRecord,
} from "@/types/trainingOperations";
import {
  CANONICAL_COURSES,
  CANONICAL_CURRICULUM_VERSIONS,
  CANONICAL_BATCHES,
  CANONICAL_ENROLLMENTS,
  CANONICAL_QUESTION_BANK,
  CANONICAL_ASSESSMENT_ATTEMPTS,
  CANONICAL_TRAINING_REQUEST,
} from "@/data/canonicalTrainingOperationsData";

let inMemoryCourses: CourseDetailRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_COURSES)
);
let inMemoryCurriculums: CurriculumVersionRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_CURRICULUM_VERSIONS)
);
let inMemoryBatches: BatchRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_BATCHES)
);
let inMemoryEnrollments: LearnerEnrollmentRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_ENROLLMENTS)
);
let inMemoryQuestions: AssessmentQuestionItem[] = JSON.parse(
  JSON.stringify(CANONICAL_QUESTION_BANK)
);
let inMemoryAttempts: AssessmentAttemptRecord[] = JSON.parse(
  JSON.stringify(CANONICAL_ASSESSMENT_ATTEMPTS)
);
let inMemoryRequests: TrainingDemandRequestRecord[] = [
  JSON.parse(JSON.stringify(CANONICAL_TRAINING_REQUEST)),
];

export const trainingOperationsRepository = {
  async getCourses(filters?: { district?: string; isGreenSkill?: boolean; query?: string }): Promise<CourseDetailRecord[]> {
    let result = JSON.parse(JSON.stringify(inMemoryCourses));
    if (filters?.district) {
      result = result.filter((c: CourseDetailRecord) => c.district.toLowerCase() === filters.district?.toLowerCase());
    }
    if (filters?.isGreenSkill !== undefined) {
      result = result.filter((c: CourseDetailRecord) => c.isGreenSkillCourse === filters.isGreenSkill);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      result = result.filter((c: CourseDetailRecord) =>
        c.title.toLowerCase().includes(q) ||
        c.skillsTaught.some((s) => s.skillName.toLowerCase().includes(q)) ||
        c.providerName.toLowerCase().includes(q)
      );
    }
    return result;
  },

  async getCourseById(courseId: string): Promise<CourseDetailRecord | null> {
    const found = inMemoryCourses.find((c) => c.courseId === courseId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async getCurriculumByCourseId(courseId: string): Promise<CurriculumVersionRecord | null> {
    const found = inMemoryCurriculums.find((cv) => cv.courseId === courseId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async getBatches(courseId?: string): Promise<BatchRecord[]> {
    if (courseId) {
      return JSON.parse(JSON.stringify(inMemoryBatches.filter((b) => b.courseId === courseId)));
    }
    return JSON.parse(JSON.stringify(inMemoryBatches));
  },

  async getEnrollments(candidateId?: string): Promise<LearnerEnrollmentRecord[]> {
    if (candidateId) {
      return JSON.parse(JSON.stringify(inMemoryEnrollments.filter((e) => e.candidateId === candidateId)));
    }
    return JSON.parse(JSON.stringify(inMemoryEnrollments));
  },

  async createEnrollment(enrollment: Partial<LearnerEnrollmentRecord>): Promise<LearnerEnrollmentRecord> {
    const newEnr: LearnerEnrollmentRecord = {
      enrollmentId: `enr-${Date.now()}`,
      candidateId: enrollment.candidateId || "cand-rohit-01",
      candidateName: enrollment.candidateName || "Rohit Sharma",
      courseId: enrollment.courseId || "crs-ev-bms-01",
      courseTitle: enrollment.courseTitle || "EV Battery Diagnostics",
      batchId: enrollment.batchId || "batch-bms-2026-01",
      status: "ENROLLED",
      progressPercentage: 0,
      skillsAcquired: [],
      enrolledAt: new Date().toISOString(),
    };
    inMemoryEnrollments.push(newEnr);
    return newEnr;
  },

  async getQuestionsBySkill(skillId?: string): Promise<AssessmentQuestionItem[]> {
    if (skillId) {
      return JSON.parse(JSON.stringify(inMemoryQuestions.filter((q) => q.skillId === skillId)));
    }
    return JSON.parse(JSON.stringify(inMemoryQuestions));
  },

  async getAttempts(candidateId?: string): Promise<AssessmentAttemptRecord[]> {
    if (candidateId) {
      return JSON.parse(JSON.stringify(inMemoryAttempts.filter((a) => a.candidateId === candidateId)));
    }
    return JSON.parse(JSON.stringify(inMemoryAttempts));
  },

  async submitAttempt(attempt: Partial<AssessmentAttemptRecord>): Promise<AssessmentAttemptRecord> {
    const newAtt: AssessmentAttemptRecord = {
      attemptId: `att-${Date.now()}`,
      assessmentId: attempt.assessmentId || "assess-asdc-bms-2026",
      assessmentTitle: attempt.assessmentTitle || "EV High-Voltage Practical Exam",
      candidateId: attempt.candidateId || "cand-rohit-01",
      candidateName: attempt.candidateName || "Rohit Sharma",
      startedAt: attempt.startedAt || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      scorePercentage: attempt.scorePercentage || 90,
      status: "VERIFIED",
      skillLevelBreakdown: attempt.skillLevelBreakdown || [
        { skillName: "High-Voltage Safety Protocols", score: 95, isVerified: true },
      ],
    };
    inMemoryAttempts.push(newAtt);
    return newAtt;
  },

  async getTrainingRequests(): Promise<TrainingDemandRequestRecord[]> {
    return JSON.parse(JSON.stringify(inMemoryRequests));
  },

  async createTrainingRequest(req: Partial<TrainingDemandRequestRecord>): Promise<TrainingDemandRequestRecord> {
    const newReq: TrainingDemandRequestRecord = {
      requestId: `req-${Date.now()}`,
      employerId: req.employerId || "emp-tata-motors",
      employerName: req.employerName || "Tata Motors",
      roleTargetTitle: req.roleTargetTitle || "EV Diagnostic Specialist",
      headcountNeeded: req.headcountNeeded || 30,
      requiredSkills: req.requiredSkills || ["Battery Management Systems (BMS)"],
      targetDistrict: req.targetDistrict || "Pune",
      timelineWeeks: req.timelineWeeks || 4,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      responses: [],
    };
    inMemoryRequests.push(newReq);
    return newReq;
  },

  async addProviderResponse(requestId: string, response: any): Promise<TrainingDemandRequestRecord | null> {
    const req = inMemoryRequests.find((r) => r.requestId === requestId);
    if (!req) return null;
    req.responses.push({
      responseId: `resp-${Date.now()}`,
      ...response,
    });
    req.status = "RESPONDED";
    return JSON.parse(JSON.stringify(req));
  },
};
