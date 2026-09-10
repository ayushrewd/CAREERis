// ==============================================================================
// CAREERIS PREDICTIVE INTELLIGENCE API VALIDATION SCRIPT
// Validates all Master Prompt 10 Endpoints
// ==============================================================================

const http = require("http");

const BASE_URL = "http://localhost:3000";

const endpoints = [
  { name: "Demand Forecasts List", path: "/api/intelligence/forecasts", method: "GET" },
  { name: "Skill Forecast Detail", path: "/api/intelligence/skills/skill-bms/forecast", method: "GET" },
  { name: "Role Forecast Detail", path: "/api/intelligence/roles/role-bms-specialist/forecast", method: "GET" },
  { name: "Geography Forecast Detail", path: "/api/intelligence/geographies/dist-pune/forecast", method: "GET" },
  { name: "Emerging Skills & Bundles", path: "/api/intelligence/emerging-skills", method: "GET" },
  { name: "Skill Obsolescence Risk", path: "/api/intelligence/skill-risk", method: "GET" },
  { name: "Scenario Compare", path: "/api/intelligence/scenarios/compare", method: "GET" },
  { name: "Predictive Alerts", path: "/api/intelligence/alerts", method: "GET" },
  { name: "Model Registry", path: "/api/intelligence/model-registry", method: "GET" },
  { name: "Model Health", path: "/api/intelligence/model-health", method: "GET" },
  { name: "Candidate Career Trajectories", path: "/api/candidate/career-trajectory", method: "GET" },
  { name: "Candidate Career Transitions", path: "/api/candidate/career-transitions", method: "GET" },
  { name: "Training Future-Fit", path: "/api/training/future-fit", method: "GET" },
  {
    name: "Scenario Simulation (POST)",
    path: "/api/intelligence/scenarios",
    method: "POST",
    body: JSON.stringify({ scenarioName: "API Test Simulation", seatDeltaPercentage: 25 }),
  },
  {
    name: "CareerIS Copilot Chat (POST)",
    path: "/api/intelligence/copilot",
    method: "POST",
    body: JSON.stringify({ query: "What skills are growing fastest?" }),
  },
];

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS — PREDICTIVE INTELLIGENCE API VALIDATION SUITE");
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
