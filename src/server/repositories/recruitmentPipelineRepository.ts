// ==============================================================================
// CAREERIS RECRUITMENT PIPELINE REPOSITORY
// Recruitment Pipeline Candidates, Notes & Tags
// ==============================================================================

import { PipelineCandidateItem, RecruitmentPipelineStage } from "@/types/employerIntelligence";

let inMemoryPipeline: PipelineCandidateItem[] = [
  {
    applicationId: "app-rohit-tm-01",
    requisitionId: "req-tm-bms-01",
    jobTitle: "Battery Management System (BMS) Calibration Specialist",
    candidateId: "cand-rohit-01",
    candidateName: "Rohit Sharma",
    candidateEmail: "rohit.sharma@domain.in",
    candidatePhone: "+91 98230 12345",
    currentStage: "SHORTLISTED",
    matchScore: 92,
    appliedAt: "2026-02-12T10:00:00Z",
    lastActivityAt: "2026-02-14T14:30:00Z",
    assignedRecruiterName: "Rahul Shinde",
    tags: ["ASDC_LEVEL_5", "PUNE_LOCAL", "EXPERIENCED_CAN_BUS"],
    notesCount: 2,
    rating: 4.8,
  },
  {
    applicationId: "app-priya-tm-01",
    requisitionId: "req-tm-bms-01",
    jobTitle: "Battery Management System (BMS) Calibration Specialist",
    candidateId: "cand-priya-02",
    candidateName: "Priya Patil",
    candidateEmail: "priya.patil@domain.in",
    currentStage: "APPLIED",
    matchScore: 68,
    appliedAt: "2026-02-15T11:20:00Z",
    lastActivityAt: "2026-02-15T11:20:00Z",
    assignedRecruiterName: "Rahul Shinde",
    tags: ["NEEDS_HV_SAFETY_VERIFICATION"],
    notesCount: 0,
  },
  {
    applicationId: "app-amit-tm-01",
    requisitionId: "req-tm-bms-01",
    jobTitle: "Battery Management System (BMS) Calibration Specialist",
    candidateId: "cand-amit-03",
    candidateName: "Amit Verma",
    candidateEmail: "amit.verma@domain.in",
    currentStage: "INTERVIEW_SCHEDULED",
    matchScore: 88,
    appliedAt: "2026-02-08T09:15:00Z",
    lastActivityAt: "2026-02-18T16:00:00Z",
    assignedRecruiterName: "Rahul Shinde",
    tags: ["MECH_TRANSITION_CANDIDATE", "CAPSTONE_VERIFIED"],
    notesCount: 3,
    rating: 4.5,
  },
  {
    applicationId: "app-rohit-bf-01",
    requisitionId: "req-bf-cnc-01",
    jobTitle: "5-Axis CNC Precision Machining Specialist",
    candidateId: "cand-rohit-01",
    candidateName: "Rohit Sharma",
    currentStage: "APPLIED",
    matchScore: 84,
    appliedAt: "2026-02-16T12:00:00Z",
    lastActivityAt: "2026-02-16T12:00:00Z",
    assignedRecruiterName: "Pooja Hegde",
    tags: ["EXCELLENT_METROLOGY"],
    notesCount: 1,
    rating: 4.6,
  },
];

export const recruitmentPipelineRepository = {
  async findAll(params?: {
    requisitionId?: string;
    stage?: RecruitmentPipelineStage;
    candidateId?: string;
    search?: string;
  }): Promise<PipelineCandidateItem[]> {
    let list = [...inMemoryPipeline];
    if (params?.requisitionId) {
      list = list.filter((p) => p.requisitionId.toLowerCase() === params.requisitionId!.toLowerCase());
    }
    if (params?.stage) {
      list = list.filter((p) => p.currentStage === params.stage);
    }
    if (params?.candidateId) {
      list = list.filter((p) => p.candidateId.toLowerCase() === params.candidateId!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter((p) => p.candidateName.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
    }
    return list;
  },

  async findByApplicationId(applicationId: string): Promise<PipelineCandidateItem | null> {
    const found = inMemoryPipeline.find((p) => p.applicationId === applicationId);
    return found || null;
  },

  async create(item: PipelineCandidateItem): Promise<PipelineCandidateItem> {
    inMemoryPipeline.unshift(item);
    return item;
  },

  async updateStage(applicationId: string, stage: RecruitmentPipelineStage): Promise<PipelineCandidateItem | null> {
    let item = inMemoryPipeline.find((p) => p.applicationId === applicationId);
    if (!item) {
      const newItem: PipelineCandidateItem = {
        applicationId,
        requisitionId: "req-tm-bms-01",
        jobTitle: "Battery Management System (BMS) Calibration Specialist",
        candidateId: "cand-two-sided-01",
        candidateName: "Rohit Sharma",
        candidateEmail: "rohit.sharma@domain.in",
        currentStage: stage,
        matchScore: 92,
        appliedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        assignedRecruiterName: "Rahul Shinde",
        tags: ["ASDC_LEVEL_5"],
        notesCount: 1,
        rating: 4.8,
      };
      inMemoryPipeline.unshift(newItem);
      return newItem;
    }
    item.currentStage = stage;
    item.lastActivityAt = new Date().toISOString();
    return item;
  },

  async addTag(applicationId: string, tag: string): Promise<PipelineCandidateItem | null> {
    const item = inMemoryPipeline.find((p) => p.applicationId === applicationId);
    if (!item) return null;
    if (!item.tags.includes(tag)) {
      item.tags.push(tag);
    }
    return item;
  },

  async updateRating(applicationId: string, rating: number): Promise<PipelineCandidateItem | null> {
    const item = inMemoryPipeline.find((p) => p.applicationId === applicationId);
    if (!item) return null;
    item.rating = rating;
    return item;
  },
};
