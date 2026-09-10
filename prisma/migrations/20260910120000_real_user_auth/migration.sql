-- Real account authentication fields and persistent sessions.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "preferredLocale" TEXT NOT NULL DEFAULT 'en';

CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");

CREATE TABLE IF NOT EXISTS "CandidateProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "headline" TEXT,
    "summary" TEXT,
    "currentDistrict" TEXT,
    "preferredStates" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "readinessScore" DOUBLE PRECISION DEFAULT 0.0,
    "resumeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CandidateProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "CandidateProfile_userId_key" ON "CandidateProfile"("userId");

CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Session_token_key" ON "Session"("token");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
