ALTER TABLE "CandidateProfile" ADD COLUMN IF NOT EXISTS "targetJobRoleId" TEXT;

CREATE TABLE "DiagnosticAssessment" (
    "id" TEXT NOT NULL,
    "candidateProfileId" TEXT NOT NULL,
    "targetRoleTitle" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "answers" JSONB,
    "results" JSONB,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "DiagnosticAssessment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "DiagnosticAssessment_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "DiagnosticAssessment_candidateProfileId_createdAt_idx" ON "DiagnosticAssessment"("candidateProfileId", "createdAt");
