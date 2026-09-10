// ==============================================================================
// CAREERIS CENTRAL REACTIVE PLATFORM STORE
// Cross-role state management connecting Candidates, Employers, ITIs, and Govt
// ==============================================================================

import {
  Job,
  Skill,
  CandidateProfile,
  Company,
  Course,
  TrainingProvider,
  NotificationItem,
  UserRole,
  ProficiencyLevel,
  EvidenceVerificationStatus,
} from "@/types";
import {
  DEMO_JOBS,
  DEMO_SKILLS,
  DEMO_COMPANIES,
  DEMO_COURSES,
  DEMO_TRAINING_PROVIDERS,
  DEMO_CANDIDATE,
  DEMO_NOTIFICATIONS,
} from "@/data/demoData";
import { recordAuditEvent } from "@/lib/audit";

export type ApplicationStage =
  | "APPLIED"
  | "VIEWED"
  | "SHORTLISTED"
  | "ASSESSMENT_REQUESTED"
  | "INTERVIEW_SCHEDULED"
  | "OFFERED"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN";

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyId: string;
  candidateId: string;
  candidateName: string;
  candidateHeadline: string;
  matchScore: number;
  stage: ApplicationStage;
  appliedAt: string;
  updatedAt: string;
  coverNote?: string;
  attachedEvidences?: string[];
  feedbackNotes?: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  skillId: string;
  difficulty: "FOUNDATIONAL" | "INTERMEDIATE" | "ADVANCED";
}

export interface AssessmentDefinition {
  id: string;
  code: string;
  title: string;
  skillId: string;
  skillName: string;
  category: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  difficulty: "FOUNDATIONAL" | "INTERMEDIATE" | "ADVANCED";
  description: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentAttemptRecord {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  candidateId: string;
  score: number;
  isPassed: boolean;
  proficiencyGranted: ProficiencyLevel;
  strengths: string[];
  weaknesses: string[];
  completedAt: string;
}

export interface InterviewRecord {
  id: string;
  applicationId: string;
  jobTitle: string;
  companyName: string;
  candidateName: string;
  candidateId: string;
  scheduledAt: string;
  durationMinutes: number;
  format: "VIDEO_CALL" | "ON_SITE" | "TECHNICAL_PANEL";
  locationOrLink: string;
  interviewerName: string;
  notes?: string;
  status: "SCHEDULED" | "COMPLETED" | "RESCHEDULED" | "CANCELLED";
  feedback?: {
    technicalScore: number;
    communicationScore: number;
    decision: "RECOMMEND_HIRE" | "NEEDS_TRAINING" | "REJECT";
    comments: string;
  };
}

export interface MessageRecord {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface ConversationSummary {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

// ------------------------------------------------------------------------------
// INITIAL SEED DATA FOR INTERACTIVE STORE
// ------------------------------------------------------------------------------

export const INITIAL_ASSESSMENTS: AssessmentDefinition[] = [
  {
    id: "asmt-bms-01",
    code: "ASMT-EV-BMS",
    title: "Battery Management Systems (BMS) Calibration & Diagnostics",
    skillId: "skill-bms",
    skillName: "Battery Management Systems (BMS)",
    category: "Automotive & Electric Mobility",
    durationMinutes: 15,
    totalQuestions: 4,
    passingScore: 75,
    difficulty: "ADVANCED",
    description: "Proctored technical evaluation of cell balancing algorithms, CAN bus telemetry analysis, and thermal runaway mitigation.",
    questions: [
      {
        id: "q1",
        question: "In active cell balancing for high-voltage EV battery packs, what is the primary advantage over passive shunt resistor balancing?",
        options: [
          "Lower component count and simpler microcontroller code",
          "Energy is transferred to adjacent or pack cells with minimal heat dissipation",
          "It completely eliminates the need for thermal sensors",
          "It allows operating cells above their maximum chemical cutoff voltage",
        ],
        correctOptionIndex: 1,
        explanation: "Active cell balancing transfers charge between cells via capacitive or inductive energy storage rather than dissipating energy as waste heat.",
        skillId: "skill-bms",
        difficulty: "ADVANCED",
      },
      {
        id: "q2",
        question: "Which CAN standard message identifier bit length is used in CAN 2.0B extended frame architectures common in automotive telematics?",
        options: ["11-bit identifier", "29-bit identifier", "64-bit identifier", "8-bit identifier"],
        correctOptionIndex: 1,
        explanation: "CAN 2.0B uses an extended 29-bit identifier frame format allowing over 500 million distinct message IDs.",
        skillId: "skill-bms",
        difficulty: "INTERMEDIATE",
      },
      {
        id: "q3",
        question: "What is the primary indicator of impending thermal runaway in a Lithium Iron Phosphate (LFP) prismatic cell?",
        options: [
          "Linear rise in internal resistance with zero temperature shift",
          "Sudden sharp drop in cell voltage accompanied by abnormal exponential temperature rise (dT/dt)",
          "Gradual increase in open-circuit voltage above 4.2V",
          "Immediate cessation of all CAN communication packets",
        ],
        correctOptionIndex: 1,
        explanation: "Internal micro-short circuits cause a sharp voltage drop and rapid exothermic self-heating (abnormal dT/dt).",
        skillId: "skill-bms",
        difficulty: "ADVANCED",
      },
      {
        id: "q4",
        question: "Why is high-voltage isolation monitoring (ISO-12003) critical prior to energizing an electric vehicle powertrain contactor?",
        options: [
          "To test the 12V auxiliary lead-acid battery state of charge",
          "To detect chassis ground leakage faults and prevent electric shock to technicians",
          "To synchronize the motor inverter pulse-width modulation frequency",
          "To reduce regenerative braking torque response lag",
        ],
        correctOptionIndex: 1,
        explanation: "HV isolation monitoring ensures galvanic isolation between high voltage DC bus (>400V) and vehicle chassis earth.",
        skillId: "skill-bms",
        difficulty: "INTERMEDIATE",
      },
    ],
  },
  {
    id: "asmt-plc-01",
    code: "ASMT-MFG-PLC",
    title: "Industry 4.0 PLC & SCADA Programming",
    skillId: "skill-plc",
    skillName: "PLC Automation & SCADA",
    category: "Advanced Manufacturing",
    durationMinutes: 15,
    totalQuestions: 3,
    passingScore: 70,
    difficulty: "INTERMEDIATE",
    description: "Evaluates ladder logic sequence programming, timer/counter routines, and Siemens PROFINET network diagnosis.",
    questions: [
      {
        id: "q-plc-1",
        question: "In Siemens TIA Portal, what is the key functional difference between a Function (FC) and a Function Block (FB)?",
        options: [
          "An FC has an associated Instance Data Block (DB) to retain memory, whereas an FB does not",
          "An FB has an associated Instance Data Block (DB) to retain state across scan cycles, whereas an FC does not",
          "FCs can only be written in Statement List (STL)",
          "FBs can only execute once per system boot",
        ],
        correctOptionIndex: 1,
        explanation: "Function Blocks (FBs) retain internal static variables in an associated Instance Data Block (DB).",
        skillId: "skill-plc",
        difficulty: "INTERMEDIATE",
      },
      {
        id: "q-plc-2",
        question: "What industrial communication protocol provides deterministic, real-time synchronization under 1ms for multi-axis servo motion?",
        options: ["Modbus RTU", "PROFINET IRT (Isochronous Real-Time)", "HTTP REST API", "Standard TCP/IP Socket"],
        correctOptionIndex: 1,
        explanation: "PROFINET IRT delivers hard real-time isochronous cycle times required for coordinated multi-axis motion.",
        skillId: "skill-plc",
        difficulty: "ADVANCED",
      },
      {
        id: "q-plc-3",
        question: "Which ladder logic element should be used to initiate an operation on the rising edge of a sensor input signal?",
        options: ["Normally Closed Contact (NC)", "Positive Transition Contact (P_TRIG / Rising Edge)", "Set Coil", "Timer Off-Delay (TOF)"],
        correctOptionIndex: 1,
        explanation: "Positive edge detection (P_TRIG) pulses high for exactly one PLC scan cycle when input transitions from 0 to 1.",
        skillId: "skill-plc",
        difficulty: "FOUNDATIONAL",
      },
    ],
  },
];

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "app-01",
    jobId: "job-01",
    jobTitle: "Battery Management System (BMS) Calibration Specialist",
    companyName: "Tata Motors EV",
    companyId: "comp-tata-motors",
    candidateId: "cand-rohit-01",
    candidateName: "Rohit Sharma",
    candidateHeadline: "Mechatronics Technician & Certified EV Battery Systems Specialist",
    matchScore: 94,
    stage: "INTERVIEW_SCHEDULED",
    appliedAt: "2026-02-21T10:30:00Z",
    updatedAt: "2026-02-26T15:00:00Z",
    coverNote: "I have completed diploma in Mechatronics and hold an assessment-verified score of 92/100 in BMS testing with Python CAN scripts.",
    attachedEvidences: ["CAN_Bus_Diagnostic_v2.py", "Govt_Polytechnic_Pune_Diploma.pdf"],
    feedbackNotes: "Candidate scored 92% on proctored BMS assessment. Practical lab experience verified.",
  },
  {
    id: "app-02",
    jobId: "job-02",
    jobTitle: "Industrial Automation & Siemens PLC Engineer",
    companyName: "Kirloskar Pneumatic",
    companyId: "comp-kirloskar",
    candidateId: "cand-rohit-01",
    candidateName: "Rohit Sharma",
    candidateHeadline: "Mechatronics Technician & Certified EV Battery Systems Specialist",
    matchScore: 88,
    stage: "SHORTLISTED",
    appliedAt: "2026-02-22T14:15:00Z",
    updatedAt: "2026-02-25T11:00:00Z",
    coverNote: "Experienced in TIA Portal S7-1200 rigging and SCADA configuration at ITI Aundh lab.",
  },
];

export const INITIAL_INTERVIEWS: InterviewRecord[] = [
  {
    id: "int-01",
    applicationId: "app-01",
    jobTitle: "Battery Management System (BMS) Calibration Specialist",
    companyName: "Tata Motors EV",
    candidateName: "Rohit Sharma",
    candidateId: "cand-rohit-01",
    scheduledAt: "2026-03-02T11:00:00Z",
    durationMinutes: 45,
    format: "TECHNICAL_PANEL",
    locationOrLink: "Tata Motors Plant 2, Chakan Industrial Area, Pune (Gate 3 Lab)",
    interviewerName: "Priya Mehta (Lead Battery Powertrain)",
    notes: "Technical round covering CAN bus packet inspection and high-voltage isolation troubleshooting.",
    status: "SCHEDULED",
  },
];

export const INITIAL_MESSAGES: MessageRecord[] = [
  {
    id: "msg-01",
    conversationId: "conv-rohit-tata",
    senderId: "user-emp-01",
    senderName: "Priya Mehta (Tata Motors EV)",
    senderRole: "EMPLOYER",
    recipientId: "user-cand-01",
    recipientName: "Rohit Sharma",
    content: "Hello Rohit, we reviewed your verified BMS assessment score (92%) and CAN telemetry project repo. We would like to invite you for a technical round on Monday at our Chakan EV plant.",
    sentAt: "2026-02-26T15:05:00Z",
    isRead: true,
  },
  {
    id: "msg-02",
    conversationId: "conv-rohit-tata",
    senderId: "user-cand-01",
    senderName: "Rohit Sharma",
    senderRole: "CANDIDATE",
    recipientId: "user-emp-01",
    recipientName: "Priya Mehta (Tata Motors EV)",
    content: "Thank you Priya! I am available at 11:00 AM on Monday and look forward to discussing the BMS calibration role.",
    sentAt: "2026-02-26T15:30:00Z",
    isRead: true,
  },
];

// ------------------------------------------------------------------------------
// IN-MEMORY / LOCALSTORAGE STORE CLASS
// ------------------------------------------------------------------------------

class PlatformStore {
  private jobs: Job[] = [...DEMO_JOBS];
  private skills: Skill[] = [...DEMO_SKILLS];
  private candidate: CandidateProfile = { ...DEMO_CANDIDATE };
  private applications: ApplicationRecord[] = [...INITIAL_APPLICATIONS];
  private assessments: AssessmentDefinition[] = [...INITIAL_ASSESSMENTS];
  private assessmentAttempts: AssessmentAttemptRecord[] = [];
  private interviews: InterviewRecord[] = [...INITIAL_INTERVIEWS];
  private messages: MessageRecord[] = [...INITIAL_MESSAGES];
  private notifications: NotificationItem[] = [...DEMO_NOTIFICATIONS];
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("careeris_jobs", JSON.stringify(this.jobs));
      localStorage.setItem("careeris_candidate", JSON.stringify(this.candidate));
      localStorage.setItem("careeris_applications", JSON.stringify(this.applications));
      localStorage.setItem("careeris_interviews", JSON.stringify(this.interviews));
      localStorage.setItem("careeris_messages", JSON.stringify(this.messages));
      localStorage.setItem("careeris_notifications", JSON.stringify(this.notifications));
      localStorage.setItem("careeris_attempts", JSON.stringify(this.assessmentAttempts));
    } catch (e) {
      console.warn("Storage save failed", e);
    }
    this.notify();
  }

  private loadFromStorage() {
    try {
      const storedJobs = localStorage.getItem("careeris_jobs");
      if (storedJobs) this.jobs = JSON.parse(storedJobs);

      const storedCandidate = localStorage.getItem("careeris_candidate");
      if (storedCandidate) this.candidate = JSON.parse(storedCandidate);

      const storedApps = localStorage.getItem("careeris_applications");
      if (storedApps) this.applications = JSON.parse(storedApps);

      const storedInts = localStorage.getItem("careeris_interviews");
      if (storedInts) this.interviews = JSON.parse(storedInts);

      const storedMsgs = localStorage.getItem("careeris_messages");
      if (storedMsgs) this.messages = JSON.parse(storedMsgs);

      const storedNotifs = localStorage.getItem("careeris_notifications");
      if (storedNotifs) this.notifications = JSON.parse(storedNotifs);

      const storedAttempts = localStorage.getItem("careeris_attempts");
      if (storedAttempts) this.assessmentAttempts = JSON.parse(storedAttempts);
    } catch (e) {
      console.warn("Storage load failed", e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- GETTERS ---
  public getJobs(): Job[] {
    return this.jobs;
  }

  public getJobById(id: string): Job | undefined {
    return this.jobs.find((j) => j.id === id);
  }

  public getSkills(): Skill[] {
    return this.skills;
  }

  public getSkillById(id: string): Skill | undefined {
    return this.skills.find((s) => s.id === id);
  }

  public getCandidateProfile(): CandidateProfile {
    return this.candidate;
  }

  public getApplications(): ApplicationRecord[] {
    return this.applications;
  }

  public getApplicationsByCandidate(candidateId: string): ApplicationRecord[] {
    return this.applications.filter((a) => a.candidateId === candidateId);
  }

  public getApplicationsByJob(jobId: string): ApplicationRecord[] {
    return this.applications.filter((a) => a.jobId === jobId);
  }

  public getAssessments(): AssessmentDefinition[] {
    return this.assessments;
  }

  public getAssessmentById(id: string): AssessmentDefinition | undefined {
    return this.assessments.find((a) => a.id === id);
  }

  public getAssessmentAttempts(candidateId?: string): AssessmentAttemptRecord[] {
    if (candidateId) {
      return this.assessmentAttempts.filter((a) => a.candidateId === candidateId);
    }
    return this.assessmentAttempts;
  }

  public getInterviews(): InterviewRecord[] {
    return this.interviews;
  }

  public getMessages(conversationId?: string): MessageRecord[] {
    if (conversationId) {
      return this.messages.filter((m) => m.conversationId === conversationId);
    }
    return this.messages;
  }

  public getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  // --- ACTIONS ---

  public applyForJob(params: {
    jobId: string;
    coverNote?: string;
    attachedEvidences?: string[];
  }): ApplicationRecord {
    const job = this.getJobById(params.jobId);
    if (!job) throw new Error("Job not found");

    // Check if already applied
    const existing = this.applications.find(
      (a) => a.jobId === params.jobId && a.candidateId === this.candidate.id
    );
    if (existing) return existing;

    const breakdown = this.calculateMatchBreakdown(job, this.candidate);

    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      companyId: job.companyId,
      candidateId: this.candidate.id,
      candidateName: "Rohit Sharma",
      candidateHeadline: this.candidate.headline,
      matchScore: breakdown.overallMatchPercentage,
      stage: "APPLIED",
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      coverNote: params.coverNote,
      attachedEvidences: params.attachedEvidences || ["Verified_Skill_Passport.pdf"],
    };

    this.applications.unshift(newApp);

    // Create Notification for Employer
    this.addNotification({
      userId: "user-emp-01",
      type: "APPLICATION_UPDATE",
      title: `New Candidate Applied: ${job.title}`,
      message: `Rohit Sharma applied with ${breakdown.overallMatchPercentage}% explainable skill fit.`,
      actionUrl: `/employer/jobs/${job.id}`,
    });

    // Record Audit
    recordAuditEvent({
      userId: "user-cand-01",
      userName: "Rohit Sharma",
      userRole: "CANDIDATE",
      action: "JOB_APPLICATION_SUBMITTED",
      entity: "Application",
      entityId: newApp.id,
      details: { jobId: job.id, jobTitle: job.title, matchScore: newApp.matchScore },
    });

    this.saveToStorage();
    return newApp;
  }

  public updateApplicationStage(appId: string, stage: ApplicationStage, notes?: string) {
    const app = this.applications.find((a) => a.id === appId);
    if (!app) return;

    app.stage = stage;
    app.updatedAt = new Date().toISOString();
    if (notes) app.feedbackNotes = notes;

    // Notify Candidate
    this.addNotification({
      userId: app.candidateId,
      type: "APPLICATION_UPDATE",
      title: `Application Status Updated: ${app.jobTitle}`,
      message: `Your application at ${app.companyName} is now: ${stage.replace("_", " ")}.`,
      actionUrl: "/candidate/applications",
    });

    recordAuditEvent({
      userId: "user-emp-01",
      userName: "Employer Team",
      userRole: "EMPLOYER",
      action: "APPLICATION_STAGE_CHANGED",
      entity: "Application",
      entityId: appId,
      details: { stage, jobTitle: app.jobTitle },
    });

    this.saveToStorage();
  }

  public submitAssessmentAttempt(params: {
    assessmentId: string;
    answers: Record<string, number>; // questionId -> selectedOptionIndex
  }): AssessmentAttemptRecord {
    const asmt = this.getAssessmentById(params.assessmentId);
    if (!asmt) throw new Error("Assessment not found");

    let correctCount = 0;
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    asmt.questions.forEach((q) => {
      const selected = params.answers[q.id];
      if (selected === q.correctOptionIndex) {
        correctCount++;
        strengths.push(q.question.slice(0, 40) + "...");
      } else {
        weaknesses.push(q.question.slice(0, 40) + "...");
      }
    });

    const score = Math.round((correctCount / asmt.questions.length) * 100);
    const isPassed = score >= asmt.passingScore;

    let proficiencyGranted: ProficiencyLevel = "FOUNDATIONAL";
    if (score >= 90) proficiencyGranted = "EXPERT";
    else if (score >= 75) proficiencyGranted = "ADVANCED";
    else if (score >= 60) proficiencyGranted = "INTERMEDIATE";

    const attempt: AssessmentAttemptRecord = {
      id: `att-${Date.now()}`,
      assessmentId: asmt.id,
      assessmentTitle: asmt.title,
      candidateId: this.candidate.id,
      score,
      isPassed,
      proficiencyGranted,
      strengths: strengths.slice(0, 2),
      weaknesses: weaknesses.slice(0, 2),
      completedAt: new Date().toISOString(),
    };

    this.assessmentAttempts.unshift(attempt);

    // Update or Add to Candidate's Skill Passport
    const existingSkill = this.candidate.skills.find((s) => s.skillId === asmt.skillId);
    if (existingSkill) {
      existingSkill.assessedScore = score;
      existingSkill.claimedProficiency = proficiencyGranted;
      existingSkill.verificationStatus = isPassed ? "ASSESSMENT_VERIFIED" : "SELF_ATTESTED";
      existingSkill.verifiedAt = new Date().toISOString();
    } else {
      this.candidate.skills.push({
        skillId: asmt.skillId,
        skillName: asmt.skillName,
        claimedProficiency: proficiencyGranted,
        assessedScore: score,
        verificationStatus: isPassed ? "ASSESSMENT_VERIFIED" : "SELF_ATTESTED",
        verifiedAt: new Date().toISOString(),
        evidenceCount: 1,
      });
    }

    // Recalculate Candidate Overall Readiness Score
    this.candidate.readinessScore = this.calculateOverallReadinessScore(this.candidate);

    // Add Notification
    this.addNotification({
      userId: "user-cand-01",
      type: "SKILL_VERIFICATION",
      title: `Assessment Completed: ${asmt.title}`,
      message: `You scored ${score}%. Skill '${asmt.skillName}' is now marked ${isPassed ? "PROCTORED VERIFIED" : "Self Attested"}.`,
      actionUrl: "/candidate/skills",
    });

    recordAuditEvent({
      userId: "user-cand-01",
      userName: "Rohit Sharma",
      userRole: "CANDIDATE",
      action: "ASSESSMENT_ATTEMPT_RECORDED",
      entity: "AssessmentAttempt",
      entityId: attempt.id,
      details: { skill: asmt.skillName, score, isPassed, proficiencyGranted },
    });

    this.saveToStorage();
    return attempt;
  }

  public createJob(jobData: Omit<Job, "id" | "createdAt">): Job {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDemoData: true,
    };

    this.jobs.unshift(newJob);

    // Broadcast Data Alert for Government & Candidate match radar
    this.addNotification({
      userId: "user-cand-01",
      type: "JOB_MATCH",
      title: `New Requisition: ${newJob.title}`,
      message: `${newJob.companyName} published ${newJob.openPositions} positions in ${newJob.district}.`,
      actionUrl: `/candidate/jobs/${newJob.id}`,
    });

    recordAuditEvent({
      userId: "user-emp-01",
      userName: "Priya Mehta",
      userRole: "EMPLOYER",
      action: "JOB_REQUISITION_CREATED",
      entity: "Job",
      entityId: newJob.id,
      details: { title: newJob.title, positions: newJob.openPositions, district: newJob.district },
    });

    this.saveToStorage();
    return newJob;
  }

  public scheduleInterview(params: {
    applicationId: string;
    scheduledAt: string;
    durationMinutes: number;
    format: "VIDEO_CALL" | "ON_SITE" | "TECHNICAL_PANEL";
    locationOrLink: string;
    interviewerName: string;
    notes?: string;
  }): InterviewRecord {
    const app = this.applications.find((a) => a.id === params.applicationId);
    if (!app) throw new Error("Application not found");

    const newInterview: InterviewRecord = {
      id: `int-${Date.now()}`,
      applicationId: app.id,
      jobTitle: app.jobTitle,
      companyName: app.companyName,
      candidateName: app.candidateName,
      candidateId: app.candidateId,
      scheduledAt: params.scheduledAt,
      durationMinutes: params.durationMinutes,
      format: params.format,
      locationOrLink: params.locationOrLink,
      interviewerName: params.interviewerName,
      notes: params.notes,
      status: "SCHEDULED",
    };

    this.interviews.unshift(newInterview);
    this.updateApplicationStage(app.id, "INTERVIEW_SCHEDULED");

    this.saveToStorage();
    return newInterview;
  }

  public sendMessage(params: {
    conversationId: string;
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    recipientId: string;
    recipientName: string;
    content: string;
  }): MessageRecord {
    const newMsg: MessageRecord = {
      id: `msg-${Date.now()}`,
      conversationId: params.conversationId,
      senderId: params.senderId,
      senderName: params.senderName,
      senderRole: params.senderRole,
      recipientId: params.recipientId,
      recipientName: params.recipientName,
      content: params.content,
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    this.messages.push(newMsg);

    this.addNotification({
      userId: params.recipientId,
      type: "MESSAGE",
      title: `New Message from ${params.senderName}`,
      message: params.content.slice(0, 80) + "...",
      actionUrl: params.senderRole === "EMPLOYER" ? "/candidate/messages" : "/employer/messages",
    });

    this.saveToStorage();
    return newMsg;
  }

  public updateCandidateProfile(updated: Partial<CandidateProfile>) {
    this.candidate = {
      ...this.candidate,
      ...updated,
    };
    this.candidate.readinessScore = this.calculateOverallReadinessScore(this.candidate);
    this.saveToStorage();
  }

  private addNotification(item: Omit<NotificationItem, "id" | "createdAt" | "isRead">) {
    const notif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
  }

  // --- MATCHING & READINESS ALGORITHMS ---

  public calculateMatchBreakdown(job: Job, candidate: CandidateProfile) {
    const candidateSkillsMap = new Map(
      candidate.skills.map((s) => [s.skillId, s])
    );

    const strongMatches: string[] = [];
    const partialMatches: string[] = [];
    const missingSkills: string[] = [];

    let skillScoreSum = 0;
    const totalRequired = job.requiredSkills.length;

    job.requiredSkills.forEach((req) => {
      const candidateSkill = candidateSkillsMap.get(req.skillId);
      if (!candidateSkill) {
        missingSkills.push(req.name);
      } else {
        const hasVerified = candidateSkill.verificationStatus === "ASSESSMENT_VERIFIED" || candidateSkill.verificationStatus === "INSTITUTE_VERIFIED";
        const score = candidateSkill.assessedScore || 70;

        if (hasVerified && score >= 80) {
          strongMatches.push(req.name);
          skillScoreSum += 1.0;
        } else {
          partialMatches.push(req.name);
          skillScoreSum += 0.7;
        }
      }
    });

    const skillMatchPercentage = totalRequired > 0 ? Math.round((skillScoreSum / totalRequired) * 100) : 100;

    // Experience Match
    const totalCandidateExp = candidate.experience.length * 1.5;
    const expMatchPercentage = totalCandidateExp >= job.minExperience ? 100 : Math.round((totalCandidateExp / Math.max(job.minExperience, 1)) * 100);

    // Location Fit (e.g. Pune district match)
    const isDistrictMatch = candidate.currentDistrict.toLowerCase() === job.district.toLowerCase();
    const isStateMatch = candidate.currentState.toLowerCase() === job.state.toLowerCase();
    const locationFitPercentage = isDistrictMatch ? 100 : isStateMatch ? 80 : 50;

    // Evidence Strength
    const totalEvidences = candidate.skills.reduce((acc, s) => acc + (s.evidenceCount || 0), 0);
    const evidenceStrengthPercentage = Math.min(totalEvidences * 25, 100);

    // Overall Weighted Average
    const overallMatchPercentage = Math.round(
      skillMatchPercentage * 0.5 +
      expMatchPercentage * 0.2 +
      locationFitPercentage * 0.15 +
      evidenceStrengthPercentage * 0.15
    );

    return {
      overallMatchPercentage,
      skillMatchPercentage,
      expMatchPercentage,
      locationFitPercentage,
      evidenceStrengthPercentage,
      strongMatches,
      partialMatches,
      missingSkills,
      locationDetails: `${job.district}, ${job.state}`,
    };
  }

  public calculateOverallReadinessScore(candidate: CandidateProfile): number {
    const verifiedSkills = candidate.skills.filter(
      (s) => s.verificationStatus === "ASSESSMENT_VERIFIED" || s.verificationStatus === "INSTITUTE_VERIFIED"
    );

    const avgScore = candidate.skills.length > 0
      ? candidate.skills.reduce((acc, s) => acc + (s.assessedScore || 65), 0) / candidate.skills.length
      : 50;

    const verificationRatio = candidate.skills.length > 0
      ? verifiedSkills.length / candidate.skills.length
      : 0;

    const readiness = Math.round(avgScore * 0.6 + verificationRatio * 30 + 10);
    return Math.min(Math.max(readiness, 0), 100);
  }
}

export const platformStore = new PlatformStore();
