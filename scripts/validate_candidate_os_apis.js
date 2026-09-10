// ==============================================================================
// CAREERIS CANDIDATE CAREER OPERATING SYSTEM API VALIDATION SCRIPT
// Validates all Master Prompt 13 Endpoints
// ==============================================================================

const http = require("http");

const BASE_URL = "http://localhost:3000";

const endpoints = [
  {
    name: "Candidate Copilot (POST)",
    path: "/api/v1/candidate/copilot",
    method: "POST",
    body: JSON.stringify({ query: "What jobs fit me?" }),
  },
  {
    name: "Career Comparison (POST)",
    path: "/api/v1/candidate/careers/compare",
    method: "POST",
    body: JSON.stringify({}),
  },
  {
    name: "Career Simulator (POST)",
    path: "/api/v1/candidate/careers/simulate",
    method: "POST",
    body: JSON.stringify({ targetRoleId: "role-bms-specialist" }),
  },
  {
    name: "Next Best Actions (GET)",
    path: "/api/v1/candidate/next-actions",
    method: "GET",
  },
  {
    name: "Resume Optimize (POST)",
    path: "/api/v1/candidate/resume/optimize",
    method: "POST",
    body: JSON.stringify({ targetJobId: "job-ev-calibration-01" }),
  },
  {
    name: "Interview Prep Session (GET)",
    path: "/api/v1/candidate/interview-prep",
    method: "GET",
  },
  {
    name: "Interview Prep Mock Answer (POST)",
    path: "/api/v1/candidate/interview-prep",
    method: "POST",
    body: JSON.stringify({
      sessionId: "prep-tata-bms-01",
      questionId: "q-01",
      answerText: "Isolate HVIL loop using calibrated multimeter and verify zero voltage before MSD disconnect.",
    }),
  },
  {
    name: "Career Journey Milestones (GET)",
    path: "/api/v1/candidate/journey",
    method: "GET",
  },
  {
    name: "Rejection Intelligence Diagnostics (GET)",
    path: "/api/v1/candidate/rejection-intelligence",
    method: "GET",
  },
];

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS — CANDIDATE CAREER OS API VALIDATION SUITE");
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
