// ==============================================================================
// CAREERIS INTERVIEW REPOSITORY
// Multi-Round Interview Schedules & Structured Evaluations
// ==============================================================================

import { InterviewRecordDetail, InterviewStatus } from "@/types/employerIntelligence";

let inMemoryInterviews: InterviewRecordDetail[] = [
  {
    id: "int-tm-amit-01",
    applicationId: "app-amit-tm-01",
    requisitionId: "req-tm-bms-01",
    candidateId: "cand-amit-03",
    candidateName: "Amit Verma",
    jobTitle: "Battery Management System (BMS) Calibration Specialist",
    roundNumber: 1,
    roundName: "Technical Panel & CAN Bus Validation",
    format: "TECHNICAL_PANEL",
    scheduledAt: "2026-03-02T10:30:00Z",
    durationMinutes: 60,
    locationOrMeetingLink: "Tata Motors EV Tech Center Pune / MS Teams Link",
    interviewerId: "user-employer-tm-02",
    interviewerName: "Deepa Menon",
    status: "CONFIRMED",
    feedback: {
      overallScore: 4.5,
      recommendation: "STRONG_HIRE",
      evaluations: [
        { criteriaName: "TECHNICAL_SKILL", score: 5, feedbackComment: "Demonstrated thorough grasp of CAN DBC file parsing and cell voltage balancing." },
        { criteriaName: "PROBLEM_SOLVING", score: 4, feedbackComment: "Solved thermal runaway edge condition scenario logically." },
        { criteriaName: "DOMAIN_KNOWLEDGE", score: 4.5, feedbackComment: "High awareness of AIS 038 Rev 2 safety regulations." },
      ],
      summaryComments: "Excellent practical candidate who completed the Chakan Capstone Hardware Project.",
      assessedSkills: [
        { skillId: "skill-bms", skillName: "Battery Management Systems (BMS)", assessedProficiency: "ADVANCED" },
        { skillId: "skill-can", skillName: "CAN Bus Communication", assessedProficiency: "ADVANCED" },
      ],
      submittedAt: "2026-03-02T12:00:00Z",
      submittedBy: "Deepa Menon",
    },
  },
  {
    id: "int-tm-rohit-01",
    applicationId: "app-rohit-tm-01",
    requisitionId: "req-tm-bms-01",
    candidateId: "cand-rohit-01",
    candidateName: "Rohit Sharma",
    jobTitle: "Battery Management System (BMS) Calibration Specialist",
    roundNumber: 1,
    roundName: "Technical Systems Diagnostic",
    format: "ON_SITE",
    scheduledAt: "2026-03-05T14:00:00Z",
    durationMinutes: 45,
    locationOrMeetingLink: "Chakan Plant Building C, Pune",
    interviewerId: "user-employer-tm-02",
    interviewerName: "Deepa Menon",
    status: "SCHEDULED",
  },
];

export const interviewRepository = {
  async findAll(params?: {
    requisitionId?: string;
    candidateId?: string;
    interviewerId?: string;
    status?: InterviewStatus;
  }): Promise<InterviewRecordDetail[]> {
    let list = [...inMemoryInterviews];
    if (params?.requisitionId) {
      list = list.filter((i) => i.requisitionId.toLowerCase() === params.requisitionId!.toLowerCase());
    }
    if (params?.candidateId) {
      list = list.filter((i) => i.candidateId.toLowerCase() === params.candidateId!.toLowerCase());
    }
    if (params?.interviewerId) {
      list = list.filter((i) => i.interviewerId === params.interviewerId);
    }
    if (params?.status) {
      list = list.filter((i) => i.status === params.status);
    }
    return list;
  },

  async findById(id: string): Promise<InterviewRecordDetail | null> {
    const found = inMemoryInterviews.find((i) => i.id === id);
    return found || null;
  },

  async create(data: Omit<InterviewRecordDetail, "id">): Promise<InterviewRecordDetail> {
    const newInterview: InterviewRecordDetail = {
      ...data,
      id: `int-${Date.now().toString(36)}`,
    };
    inMemoryInterviews.unshift(newInterview);
    return newInterview;
  },

  async updateStatus(id: string, status: InterviewStatus, cancellationReason?: string): Promise<InterviewRecordDetail | null> {
    const item = inMemoryInterviews.find((i) => i.id === id);
    if (!item) return null;
    item.status = status;
    if (cancellationReason) item.cancellationReason = cancellationReason;
    return item;
  },

  async submitFeedback(id: string, feedback: NonNullable<InterviewRecordDetail["feedback"]>): Promise<InterviewRecordDetail | null> {
    const item = inMemoryInterviews.find((i) => i.id === id);
    if (!item) return null;
    item.feedback = feedback;
    item.status = "COMPLETED";
    return item;
  },
};
