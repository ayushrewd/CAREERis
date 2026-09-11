ALTER TABLE "DataSource"
  ADD COLUMN "submittedByUserId" TEXT,
  ADD COLUMN "sourceUrl" TEXT,
  ADD COLUMN "verificationStatus" TEXT NOT NULL DEFAULT 'SELF_ATTESTED';

ALTER TABLE "DemandSignal"
  ADD COLUMN "proficiency" "ProficiencyLevel";

ALTER TABLE "SupplySignal"
  ADD COLUMN "proficiency" "ProficiencyLevel";

CREATE TABLE "TechnologySignal" (
  "id" TEXT NOT NULL,
  "dataSourceId" TEXT NOT NULL,
  "skillId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "sourceUrl" TEXT NOT NULL,
  "observedAt" TIMESTAMP(3) NOT NULL,
  "labourDemandValidated" BOOLEAN NOT NULL DEFAULT false,
  "validationEvidence" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TechnologySignal_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DataSource_sourceType_collectionDate_idx" ON "DataSource"("sourceType", "collectionDate");
CREATE INDEX "DataSource_submittedByUserId_idx" ON "DataSource"("submittedByUserId");
CREATE INDEX "DemandSignal_skillId_recordedDate_idx" ON "DemandSignal"("skillId", "recordedDate");
CREATE INDEX "DemandSignal_districtId_recordedDate_idx" ON "DemandSignal"("districtId", "recordedDate");
CREATE INDEX "SupplySignal_skillId_recordedDate_idx" ON "SupplySignal"("skillId", "recordedDate");
CREATE INDEX "SupplySignal_districtId_recordedDate_idx" ON "SupplySignal"("districtId", "recordedDate");
CREATE UNIQUE INDEX "TechnologySignal_dataSourceId_skillId_key" ON "TechnologySignal"("dataSourceId", "skillId");
CREATE INDEX "TechnologySignal_skillId_observedAt_idx" ON "TechnologySignal"("skillId", "observedAt");

ALTER TABLE "DataSource"
  ADD CONSTRAINT "DataSource_submittedByUserId_fkey"
  FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "TechnologySignal"
  ADD CONSTRAINT "TechnologySignal_dataSourceId_fkey"
  FOREIGN KEY ("dataSourceId") REFERENCES "DataSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TechnologySignal"
  ADD CONSTRAINT "TechnologySignal_skillId_fkey"
  FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Neon exposes lakebase_vector; local development databases may not. The
-- conditional keeps the committed migration reproducible in both environments.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'lakebase_vector') THEN
    EXECUTE 'CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE';
  ELSIF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'vector') THEN
    EXECUTE 'CREATE EXTENSION IF NOT EXISTS vector';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vector') THEN
    EXECUTE 'ALTER TABLE "SkillEmbedding" ADD COLUMN IF NOT EXISTS "semanticVector" vector(1536)';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_am WHERE amname = 'lakebase_ann') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS "SkillEmbedding_semanticVector_ann" ON "SkillEmbedding" USING lakebase_ann ("semanticVector" vector_cosine_ops)';
  END IF;
END $$;
