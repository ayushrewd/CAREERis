import { z } from "zod";

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
});

export const JobFilterSchema = PaginationQuerySchema.extend({
  state: z.string().optional(),
  district: z.string().optional(),
  jobType: z.string().optional(),
  minSalary: z.coerce.number().optional(),
  skillId: z.string().optional(),
});

export const CreateJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  companyId: z.string().default("comp-tata-motors"),
  companyName: z.string().default("Tata Motors EV"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "APPRENTICESHIP", "INTERNSHIP", "CONTRACT", "HYBRID", "REMOTE"]).default("FULL_TIME"),
  minExperience: z.number().int().min(0).default(0),
  maxExperience: z.number().int().optional(),
  salaryRangeINR: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }),
  openPositions: z.number().int().positive().default(1),
  district: z.string().min(2),
  state: z.string().min(2),
  requiredSkills: z.array(
    z.object({
      skillId: z.string(),
      name: z.string(),
      level: z.enum(["FOUNDATIONAL", "INTERMEDIATE", "ADVANCED", "EXPERT"]).default("INTERMEDIATE"),
      isMandatory: z.boolean().default(true),
    })
  ).min(1, "At least 1 required skill must be defined"),
});

export const CreateApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverNote: z.string().max(1000).optional(),
  selectedEvidenceIds: z.array(z.string()).optional(),
});

export const UpdateApplicationStageSchema = z.object({
  stage: z.enum([
    "APPLIED",
    "VIEWED",
    "SHORTLISTED",
    "ASSESSMENT_REQUESTED",
    "INTERVIEW_SCHEDULED",
    "OFFER_EXTENDED",
    "PLACED",
    "REJECTED",
    "WITHDRAWN",
  ]),
  feedbackNotes: z.string().optional(),
});

export const SubmitAssessmentAttemptSchema = z.object({
  assessmentId: z.string().min(1),
  answers: z.record(z.string(), z.number().int().min(0)),
});

export const ScheduleInterviewSchema = z.object({
  applicationId: z.string().min(1),
  scheduledAt: z.string(),
  durationMinutes: z.number().int().min(15).max(180).default(45),
  format: z.enum(["TECHNICAL_PANEL", "IN_PERSON", "ONLINE_VIDEO", "HR_SCREEN"]).default("TECHNICAL_PANEL"),
  locationOrLink: z.string().min(3),
  interviewerName: z.string().min(2),
  notes: z.string().optional(),
});

export const CandidateProfileUpdateSchema = z.object({
  headline: z.string().max(200).optional(),
  summary: z.string().max(2000).optional(),
  currentDistrict: z.string().optional(),
  currentState: z.string().optional(),
});

export const SendMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(2000),
  recipientId: z.string().min(1),
  recipientName: z.string().min(1),
});
