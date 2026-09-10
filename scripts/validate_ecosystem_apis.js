// ==============================================================================
// CAREERIS ECOSYSTEM INTEROPERABILITY API VALIDATION SCRIPT
// Validates all Master Prompt 11 Endpoints
// ==============================================================================

const http = require("http");

const BASE_URL = "http://localhost:3000";

const endpoints = [
  { name: "Identity & Memberships", path: "/api/v1/auth/identity", method: "GET" },
  { name: "Candidate Consent Grants", path: "/api/v1/consent", method: "GET" },
  { name: "Verifiable Credentials List", path: "/api/v1/credentials", method: "GET" },
  { name: "Public Minimal Credential Verification (Zero PII)", path: "/api/v1/credentials/verify/cred-asdc-bms-2026-001", method: "GET" },
  { name: "External Integrations List", path: "/api/v1/integrations", method: "GET" },
  { name: "Ingestion Quarantine Records", path: "/api/v1/integrations/quarantine", method: "GET" },
  { name: "Partner API Keys List", path: "/api/v1/partners/api-keys", method: "GET" },
  { name: "Security Audit Events", path: "/api/v1/security/audit", method: "GET" },
  { name: "System Health & Observability", path: "/api/v1/system/health", method: "GET" },
  {
    name: "Grant Consent (POST)",
    path: "/api/v1/consent",
    method: "POST",
    body: JSON.stringify({
      granteeId: "comp-tata-motors",
      granteeName: "Tata Motors PV Ltd",
      purpose: "APPLICATION_SHARING",
      dataScope: ["skills:bms"],
    }),
  },
  {
    name: "Generate Credential Share Link (POST)",
    path: "/api/v1/credentials/share",
    method: "POST",
    body: JSON.stringify({ credentialId: "cred-asdc-bms-2026-001", durationDays: 7 }),
  },
  {
    name: "Dispatch Webhook Event (POST)",
    path: "/api/v1/webhooks",
    method: "POST",
    body: JSON.stringify({ event: "CandidateShortlisted", payload: { candidateId: "cand-rohit-01" } }),
  },
];

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS — ECOSYSTEM INTEROPERABILITY API VALIDATION SUITE");
  console.log("============================================================\n");

  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    try {
      const url = new URL(ep.path, BASE_URL);
      const res = await fetch(url.toString(), {
        method: ep.method,
        headers: { "Content-Type": "application/json" },
        body: ep.body || undefined,
      });

      if (res.status === 200) {
        console.log(`[PASS] [200] ${ep.name} -> ${ep.path}`);
        passed++;
      } else {
        console.error(`[FAIL] [${res.status}] ${ep.name} -> ${ep.path}`);
        failed++;
      }
    } catch (e) {
      console.error(`[ERROR] ${ep.name} -> ${e.message}`);
      failed++;
    }
  }

  console.log("\n============================================================");
  console.log(`VALIDATION RESULT: ${passed} Passed, ${failed} Failed out of ${endpoints.length} Endpoints`);
  console.log("============================================================\n");

  if (failed > 0) process.exit(1);
}

runValidation();
