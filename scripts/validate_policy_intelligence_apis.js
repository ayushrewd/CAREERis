// ==============================================================================
// CAREERIS GOVERNMENT POLICY INTELLIGENCE & COMMAND CENTER API VALIDATION SCRIPT
// Validates all Master Prompt 16 Endpoints
// ==============================================================================

const http = require("http");

const BASE_URL = "http://localhost:3000";

const endpoints = [
  { name: "National Intelligence (GET)", path: "/api/v1/government/national", method: "GET" },
  { name: "Schemes Intelligence (GET)", path: "/api/v1/government/schemes", method: "GET" },
  { name: "District Action Plans (GET)", path: "/api/v1/government/action-plans", method: "GET" },
  {
    name: "Create Action Plan (POST)",
    path: "/api/v1/government/action-plans",
    method: "POST",
    body: JSON.stringify({ district: "Ahmedabad", state: "Gujarat", priorityScore: 85 }),
  },
  { name: "Policy Simulations (GET)", path: "/api/v1/government/simulations", method: "GET" },
  {
    name: "Simulate Policy Scenario (POST)",
    path: "/api/v1/government/simulations",
    method: "POST",
    body: JSON.stringify({ title: "Custom Solar PV Expansion", estimatedCostINR: 25000000 }),
  },
  { name: "Government Alerts (GET)", path: "/api/v1/government/alerts", method: "GET" },
  {
    name: "Create Alert (POST)",
    path: "/api/v1/government/alerts",
    method: "POST",
    body: JSON.stringify({ severity: "HIGH", title: "Capacity Alert in Gujarat", state: "Gujarat" }),
  },
  { name: "Policy Decisions (GET)", path: "/api/v1/government/decisions", method: "GET" },
  {
    name: "Approve Policy Decision (POST)",
    path: "/api/v1/government/decisions",
    method: "POST",
    body: JSON.stringify({ decisionTitle: "Sanction Decision", allocatedBudgetINR: 50000000 }),
  },
  {
    name: "Grounded Policy Advisor (POST)",
    path: "/api/v1/government/advisor",
    method: "POST",
    body: JSON.stringify({ query: "Where are the largest skill gaps in India?" }),
  },
];

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS — GOVERNMENT POLICY INTELLIGENCE API VALIDATION SUITE");
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
