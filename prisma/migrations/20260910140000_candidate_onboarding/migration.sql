ALTER TABLE "CandidateProfile" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "CandidateProfile" ADD COLUMN IF NOT EXISTS "educationSummary" TEXT;
ALTER TABLE "CandidateProfile" ADD COLUMN IF NOT EXISTS "qualification" TEXT;
ALTER TABLE "CandidateProfile" ADD COLUMN IF NOT EXISTS "experienceSummary" TEXT;
ALTER TABLE "CandidateProfile" ADD COLUMN IF NOT EXISTS "targetRole" TEXT;

CREATE TABLE "CandidateDeclaredSkill" (
    "id" TEXT NOT NULL,
    "candidateProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CandidateDeclaredSkill_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CandidateDeclaredSkill_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CandidateDeclaredSkill_candidateProfileId_normalizedName_key" ON "CandidateDeclaredSkill"("candidateProfileId", "normalizedName");
CREATE INDEX "CandidateDeclaredSkill_normalizedName_idx" ON "CandidateDeclaredSkill"("normalizedName");
