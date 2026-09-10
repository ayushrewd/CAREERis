// ==============================================================================
// CAREERIS ECOSYSTEM INTEROPERABILITY DOMAIN TYPE SYSTEM
// Identity, Consent, Verifiable Credentials, Ingestion, Webhooks & Security
// ==============================================================================

import { UserRole } from "@/types";

// ------------------------------------------------------------------------------
// 1. Digital Identity & Multi-Tenant Organization Membership
// ------------------------------------------------------------------------------

export type IdentityProviderType = "LOCAL" | "EXTERNAL_OIDC" | "ENTERPRISE_SAML" | "GOVERNMENT_SSO";

export interface OrganizationMembership {
  membershipId: string;
  userId: string;
  organizationId: string;
  organizationName: string;
  organizationType: "GOVERNMENT_BODY" | "TRAINING_INSTITUTE" | "EMPLOYER" | "INDUSTRY_COUNCIL" | "PLATFORM_ADMIN";
  roleInOrg: string; // e.g. "RECRUITER", "DISTRICT_DIRECTOR", "PRINCIPAL", "CURRICULUM_LEAD"
  assignedStateCode?: string;
  assignedDistrictId?: string;
  isActive: boolean;
  joinedAt: string;
}

export interface IIdentityProvider {
  getProviderType(): IdentityProviderType;
  authenticate(credentials: Record<string, any>): Promise<{ userId: string; userRole: UserRole; email: string }>;
  validateSession(sessionId: string): Promise<boolean>;
  revokeSession(sessionId: string): Promise<void>;
}

// ------------------------------------------------------------------------------
// 2. Explicit, Purpose-Bound Consent Engine
// ------------------------------------------------------------------------------

export type ConsentPurpose =
  | "PROFILE_SHARING"
  | "SKILL_SHARING"
  | "CREDENTIAL_SHARING"
  | "APPLICATION_SHARING"
  | "EMPLOYER_VISIBILITY"
  | "TRAINING_PROVIDER_VISIBILITY"
  | "GOVERNMENT_PROGRAM_PARTICIPATION"
  | "ANALYTICS_PARTICIPATION"
  | "COMMUNICATION";

export interface ConsentGrant {
  consentId: string;
  candidateId: string;
  granteeId: string; // Organization ID or Employer ID
  granteeName: string;
  granteeType: "EMPLOYER" | "TRAINING_PROVIDER" | "GOVERNMENT" | "INDUSTRY_COUNCIL";
  purpose: ConsentPurpose;
  grantedAt: string;
  expiresAt?: string; // Optional time-bound expiration
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  revokedAt?: string;
  dataScope: string[]; // e.g. ["skills:bms", "assessment_scores", "work_history"]
}

// ------------------------------------------------------------------------------
// 3. Verifiable Credentials & Public Verification (Zero PII)
// ------------------------------------------------------------------------------

export type CredentialStatus = "ACTIVE" | "EXPIRED" | "REVOKED" | "SUSPENDED" | "PENDING_VERIFICATION";

export interface VerifiableCredential {
  credentialId: string;
  credentialType: "SKILL_BADGE" | "VOCATIONAL_CERTIFICATE" | "APPRENTICESHIP_COMPLETION" | "ASSESSMENT_MASTERY";
  title: string;
  holderId: string;
  holderMaskedIdentifier: string; // e.g. "CAND-****-789" (Zero PII)
  skillId: string;
  skillName: string;
  proficiencyLevel: "AWARENESS" | "FOUNDATIONAL" | "PRACTITIONER" | "EXPERT" | "MASTER";
  issuerId: string;
  issuerName: string;
  issuerType: "SECTOR_SKILL_COUNCIL" | "NCVT_DGT" | "ENTERPRISE_OEM" | "POLYTECHNIC";
  issuedAt: string;
  expiresAt?: string;
  status: CredentialStatus;
  evidenceReferenceUri: string;
  digitalSignatureHash: string; // SHA-256 integrity hash
  version: string;
}

export interface PublicCredentialVerificationResult {
  isValid: boolean;
  credentialId: string;
  title: string;
  competency: string;
  issuerName: string;
  issuedAt: string;
  status: CredentialStatus;
  verificationTimestamp: string;
  verificationAuditId: string;
  securityNotice: "Zero PII: Public verification displays minimal authenticity metadata only. Candidate private PII is protected.";
}

export interface CredentialShareLink {
  shareId: string;
  credentialId: string;
  candidateId: string;
  shareUrl: string;
  expiresAt: string; // e.g. 7 days from creation
  allowedViewCount?: number;
  currentViews: number;
}

// ------------------------------------------------------------------------------
// 4. Secure Evidence & Document Exchange
// ------------------------------------------------------------------------------

export interface DocumentMetadata {
  documentId: string;
  ownerId: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  sha256Checksum: string;
  storageKey: string;
  isMalwareScanned: boolean;
  uploadedAt: string;
  accessClassification: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "SENSITIVE";
}

export interface SignedTemporaryAccessUrl {
  documentId: string;
  signedUrl: string;
  expiresAt: string;
}

// ------------------------------------------------------------------------------
// 5. External Data Ingestion, Connectors & Quarantine
// ------------------------------------------------------------------------------

export type ConnectorState = "CONFIGURED" | "TESTING" | "ACTIVE" | "PAUSED" | "FAILED" | "DEPRECATED";

export interface ExternalIntegration {
  integrationId: string;
  name: string;
  provider: string; // e.g. "ASDC Sector Skill Council API", "NCVT MIS Gateway", "MCA Corporate Registry"
  connectorType: "REST_PULL" | "WEBHOOK_RECEIVER" | "BATCH_FILE" | "SFTP";
  endpointUrl: string;
  status: ConnectorState;
  lastSyncTimestamp: string;
  frequency: "HOURLY" | "DAILY" | "WEEKLY" | "REALTIME";
  dataDomains: Array<"LABOUR_DEMAND" | "TRAINING_SEATS" | "ASSESSMENTS" | "ENTERPRISE_REQUISITIONS">;
  recordsReceivedTotal: number;
  recordsAcceptedTotal: number;
  recordsQuarantinedTotal: number;
  dataQualityScore: number; // 0 - 100
  latencyMs: number;
}

export interface QuarantineRecord {
  recordId: string;
  integrationId: string;
  sourceName: string;
  reason: "SCHEMA_MISMATCH" | "UNKNOWN_CANONICAL_SKILL" | "INVALID_GEOGRAPHY" | "DUPLICATE_SUSPECT" | "CONFLICTING_DATA";
  rawPayload: Record<string, any>;
  quarantinedAt: string;
  status: "PENDING_REVIEW" | "CORRECTED_AND_RESOLVED" | "REJECTED";
}

export interface EntityMapping {
  mappingId: string;
  externalProvider: string;
  externalEntityId: string;
  externalEntityName: string;
  canonicalEntityType: "SKILL" | "ROLE" | "GEOGRAPHY" | "ORGANIZATION";
  canonicalEntityId: string;
  canonicalEntityName: string;
  confidenceScore: number;
}

// ------------------------------------------------------------------------------
// 6. Webhooks, Idempotency & Event Outbox
// ------------------------------------------------------------------------------

export type EcosystemDomainEvent =
  | "SkillVerified"
  | "AssessmentCompleted"
  | "CredentialIssued"
  | "CredentialRevoked"
  | "ApplicationSubmitted"
  | "CandidateShortlisted"
  | "InterviewScheduled"
  | "OfferIssued"
  | "CandidateHired"
  | "TrainingCompleted"
  | "CourseUpdated"
  | "EmployerFeedbackSubmitted"
  | "MarketSignalUpdated";

export interface WebhookSubscription {
  subscriptionId: string;
  partnerOrganizationId: string;
  targetUrl: string;
  secretKeyHashed: string;
  subscribedEvents: EcosystemDomainEvent[];
  isActive: boolean;
  createdAt: string;
}

export interface WebhookDeliveryLog {
  deliveryId: string;
  subscriptionId: string;
  event: EcosystemDomainEvent;
  payload: Record<string, any>;
  status: "DELIVERED" | "FAILED" | "RETRYING" | "DEAD_LETTERED";
  httpStatusCode?: number;
  attemptCount: number;
  lastAttemptAt: string;
}

// ------------------------------------------------------------------------------
// 7. Partner Portal, API Keys & Scopes
// ------------------------------------------------------------------------------

export type ApiScope =
  | "jobs:read"
  | "jobs:write"
  | "skills:read"
  | "credentials:verify"
  | "training:read"
  | "training:write"
  | "analytics:read";

export interface ApiKeyRecord {
  keyId: string;
  partnerOrganizationId: string;
  partnerName: string;
  apiKeyMasked: string; // e.g. "pk_live_****_7x9a"
  hashedSecret: string;
  scopes: ApiScope[];
  rateLimitPerMinute: number;
  expiresAt: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  createdAt: string;
  lastUsedAt?: string;
}

// ------------------------------------------------------------------------------
// 8. Security Audit, System Health & Observability
// ------------------------------------------------------------------------------

export interface SecurityAuditEvent {
  eventId: string;
  userId?: string;
  organizationId?: string;
  eventType: "LOGIN" | "LOGOUT" | "CONSENT_GRANT" | "CONSENT_REVOCATION" | "CREDENTIAL_ISSUED" | "CREDENTIAL_VERIFIED" | "API_KEY_USED" | "DATA_EXPORT" | "PERMISSION_MODIFIED";
  ipAddress: string;
  resourceAccessed: string;
  status: "SUCCESS" | "DENIED" | "ANOMALY_DETECTED";
  details: string;
  timestamp: string;
}

export interface SystemServiceHealth {
  serviceName: string; // e.g. "PostgreSQL Database", "API Gateway", "Worker Queues", "Vector Store", "Storage Service", "ASDC Integration"
  status: "HEALTHY" | "DEGRADED" | "DOWN" | "UNKNOWN";
  latencyMs: number;
  uptimePercentage: number;
  lastCheckedAt: string;
  message?: string;
}
