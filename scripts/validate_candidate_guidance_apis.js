// ==============================================================================
// CAREERIS CANDIDATE GUIDANCE & CAREER OS API VALIDATION SCRIPT
// Validates all Master Prompt 17 Endpoints
// ==============================================================================

const http = require("http");

const BASE_URL = "http://localhost:3000";

const endpoints = [
  { name: "Career Discovery (GET)", path: "/api/v1/candidate/discovery", method: "GET" },
  { name: "Career Transitions (GET)", path: "/api/v1/candidate/transitions", method: "GET" },
  { name: "Employability Scorecard (GET)", path: "/api/v1/candidate/employability", method: "GET" },
  {
    name: "Toggle Next Action (POST)",
    path: "/api/v1/candidate/actions",
    method: "POST",
    body: JSON.stringify({ actionId: "act-01", isCompleted: true }),
  },
  { name: "Interview Practice Questions (GET)", path: "/api/v1/candidate/interview-practice", method: "GET" },
  {
    name: "Candidate Copilot Advisor (POST)",
    path: "/api/v1/candidate/copilot-advisor",
    method: "POST",
    body: JSON.stringify({ query: "Why am I not ready for the EV BMS role?" }),
  },
];

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS — CANDIDATE CAREER GUIDANCE API VALIDATION SUITE");
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
