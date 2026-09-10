ALTER TABLE "CandidateDeclaredSkill" ADD COLUMN "assessedScore" DOUBLE PRECISION;
ALTER TABLE "CandidateDeclaredSkill" ADD COLUMN "assessedAt" TIMESTAMP(3);
ALTER TABLE "CandidateDeclaredSkill" ADD COLUMN "trainingStatus" TEXT NOT NULL DEFAULT 'NOT_STARTED';
ALTER TABLE "CandidateDeclaredSkill" ADD COLUMN "trainingCompletedAt" TIMESTAMP(3);

ALTER TABLE "EmployerAccountProfile" ADD COLUMN "companyId" TEXT;
CREATE UNIQUE INDEX "EmployerAccountProfile_companyId_key" ON "EmployerAccountProfile"("companyId");

ALTER TABLE "TrainingProviderAccountProfile" ADD COLUMN "trainingProviderId" TEXT;
CREATE UNIQUE INDEX "TrainingProviderAccountProfile_trainingProviderId_key" ON "TrainingProviderAccountProfile"("trainingProviderId");
ALTER TABLE "TrainingProvider" ALTER COLUMN "isAccredited" SET DEFAULT false;

ALTER TABLE "Company" ALTER COLUMN "industryId" DROP NOT NULL;

ALTER TABLE "Project" ADD COLUMN "technologies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Project" ADD COLUMN "evidenceStatus" TEXT NOT NULL DEFAULT 'SUBMITTED';
ALTER TABLE "Project" ADD COLUMN "repositoryReachable" BOOLEAN;
ALTER TABLE "Project" ADD COLUMN "repositoryCheckedAt" TIMESTAMP(3);

CREATE TABLE "SkillProjectEvidence" (
    "id" TEXT NOT NULL,
    "candidateDeclaredSkillId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SkillProjectEvidence_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SkillProjectEvidence_candidateDeclaredSkillId_fkey" FOREIGN KEY ("candidateDeclaredSkillId") REFERENCES "CandidateDeclaredSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SkillProjectEvidence_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "SkillProjectEvidence_candidateDeclaredSkillId_projectId_key" ON "SkillProjectEvidence"("candidateDeclaredSkillId", "projectId");

ALTER TABLE "Job" ADD COLUMN "qualification" TEXT;
ALTER TABLE "Job" ADD COLUMN "locationText" TEXT;
ALTER TABLE "Job" ADD COLUMN "sectorText" TEXT;

CREATE TABLE "JobRequirement" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "proficiency" "ProficiencyLevel" NOT NULL DEFAULT 'INTERMEDIATE',
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JobRequirement_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "JobRequirement_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "JobRequirement_jobId_normalizedName_key" ON "JobRequirement"("jobId", "normalizedName");
CREATE INDEX "JobRequirement_normalizedName_idx" ON "JobRequirement"("normalizedName");

ALTER TABLE "Application" ADD COLUMN "workflowStatus" TEXT NOT NULL DEFAULT 'APPLIED';
ALTER TABLE "Application" ADD COLUMN "selectedAt" TIMESTAMP(3);
ALTER TABLE "Application" ADD COLUMN "hiredAt" TIMESTAMP(3);

ALTER TABLE "Course" ADD COLUMN "level" "ProficiencyLevel" NOT NULL DEFAULT 'FOUNDATIONAL';
ALTER TABLE "Course" ADD COLUMN "deliveryMode" TEXT;
ALTER TABLE "Course" ADD COLUMN "locationText" TEXT;
ALTER TABLE "Course" ADD COLUMN "eligibility" TEXT;
ALTER TABLE "Course" ADD COLUMN "sourceUrl" TEXT;
ALTER TABLE "Course" ADD COLUMN "enrollmentUrl" TEXT;
ALTER TABLE "Course" ADD COLUMN "evidenceNote" TEXT;

CREATE TABLE "CourseEnrollment" (
    "id" TEXT NOT NULL,
    "candidateProfileId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ENROLLED',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "completionEvidenceUrl" TEXT,
    "providerConfirmedAt" TIMESTAMP(3),
    CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CourseEnrollment_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CourseEnrollment_candidateProfileId_courseId_key" ON "CourseEnrollment"("candidateProfileId", "courseId");

ALTER TABLE "EmployerAccountProfile" ADD CONSTRAINT "EmployerAccountProfile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrainingProviderAccountProfile" ADD CONSTRAINT "TrainingProviderAccountProfile_trainingProviderId_fkey" FOREIGN KEY ("trainingProviderId") REFERENCES "TrainingProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
