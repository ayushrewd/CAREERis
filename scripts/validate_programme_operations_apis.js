// ==============================================================================
// CAREERIS PROGRAMME OPERATIONS API VALIDATION SCRIPT
// Validates all Master Prompt 12 Endpoints
// ==============================================================================

const http = require("http");

const BASE_URL = "http://localhost:3000";

const endpoints = [
  { name: "Programmes List", path: "/api/v1/programmes", method: "GET" },
  { name: "Programme By ID", path: "/api/v1/programmes/prog-pmkvy-ev-01", method: "GET" },
  { name: "Theory of Change", path: "/api/v1/programmes/prog-pmkvy-ev-01/theory-of-change", method: "GET" },
  { name: "Programme Budget", path: "/api/v1/programmes/prog-pmkvy-ev-01/budget", method: "GET" },
  { name: "Programme Outcomes", path: "/api/v1/programmes/prog-pmkvy-ev-01/outcomes", method: "GET" },
  { name: "Programme Evaluation", path: "/api/v1/programmes/prog-pmkvy-ev-01/evaluation", method: "GET" },
  { name: "Interventions Execution List", path: "/api/v1/interventions/execution", method: "GET" },
  { name: "Intervention Milestones List", path: "/api/v1/interventions/int-ev-lab-chakan-01/milestones", method: "GET" },
  { name: "Budgets Summary & List", path: "/api/v1/budgets", method: "GET" },
  { name: "Decisions Register List", path: "/api/v1/decisions", method: "GET" },
  { name: "Executive Command Center Digest", path: "/api/v1/command-center/digest", method: "GET" },
  { name: "Command Center Layers", path: "/api/v1/command-center/layers", method: "GET" },
  {
    name: "Propose Decision (POST)",
    path: "/api/v1/decisions",
    method: "POST",
    body: JSON.stringify({
      decisionType: "BUDGET_ALLOCATION",
      targetEntityId: "prog-pmkvy-ev-01",
      targetEntityName: "PMKVY 4.0 EV Mission Lab Tranche 2",
      reason: "Tranche 1 milestones completed.",
      evidenceSummary: "Safety certificates verified.",
    }),
  },
];

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS — PROGRAMME OPERATIONS API VALIDATION SUITE");
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
