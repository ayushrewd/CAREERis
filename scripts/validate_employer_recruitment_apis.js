// ==============================================================================
// CAREERIS EMPLOYER RECRUITMENT API VALIDATION SCRIPT
// Validates all Master Prompt 18 Endpoints
// ==============================================================================

const http = require("http");

const BASE_URL = "http://localhost:3000";

const endpoints = [
  { name: "Employer Requisitions (GET)", path: "/api/v1/employer/requisitions", method: "GET" },
  { name: "Single Requisition (GET)", path: "/api/v1/employer/requisitions/req-tata-ev-01", method: "GET" },
  { name: "Requisition Matching Candidates (GET)", path: "/api/v1/employer/requisitions/req-tata-ev-01/candidates", method: "GET" },
  { name: "Pipeline Board (GET)", path: "/api/v1/employer/pipeline-board?requisitionId=req-tata-ev-01", method: "GET" },
  {
    name: "Advance Pipeline Stage (POST)",
    path: "/api/v1/employer/pipeline-board",
    method: "POST",
    body: JSON.stringify({ applicationId: "app-rohit-tata-01", stage: "OFFERED", notes: "Offer stage validation" }),
  },
  { name: "Hire vs Train Decision Model (GET)", path: "/api/v1/employer/hire-vs-train", method: "GET" },
  {
    name: "Recruiter Copilot Advisor (POST)",
    path: "/api/v1/employer/recruiter-copilot",
    method: "POST",
    body: JSON.stringify({ query: "Find candidates for EV Battery Specialist" }),
  },
];

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS — EMPLOYER RECRUITMENT API VALIDATION SUITE");
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
