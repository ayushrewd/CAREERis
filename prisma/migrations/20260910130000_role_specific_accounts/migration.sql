CREATE TABLE "EmployerAccountProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "designation" TEXT,
    "industry" TEXT,
    "cinNumber" TEXT,
    "headquarters" TEXT,
    "website" TEXT,
    "canPostJobs" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EmployerAccountProfile_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "EmployerAccountProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "EmployerAccountProfile_userId_key" ON "EmployerAccountProfile"("userId");

CREATE TABLE "TrainingProviderAccountProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "registrationNo" TEXT,
    "providerType" TEXT,
    "headquarters" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TrainingProviderAccountProfile_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TrainingProviderAccountProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "TrainingProviderAccountProfile_userId_key" ON "TrainingProviderAccountProfile"("userId");

CREATE TABLE "GovernmentPlannerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentName" TEXT NOT NULL,
    "designation" TEXT,
    "district" TEXT,
    "officialId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GovernmentPlannerProfile_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "GovernmentPlannerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "GovernmentPlannerProfile_userId_key" ON "GovernmentPlannerProfile"("userId");
