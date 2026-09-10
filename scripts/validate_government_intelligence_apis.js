// ==============================================================================
// CAREERIS GOVERNMENT INTELLIGENCE API VALIDATION SCRIPT
// Validates all 23 Government Intelligence REST Endpoints
// ==============================================================================

const http = require("http");

const BASE_URL = "http://localhost:3000";

const endpoints = [
  { path: "/api/government/dashboard", method: "GET", name: "Government Dashboard" },
  { path: "/api/government/national", method: "GET", name: "National Overview" },
  { path: "/api/government/states", method: "GET", name: "States List" },
  { path: "/api/government/states/MH", method: "GET", name: "State Dossier (MH)" },
  { path: "/api/government/districts/matrix", method: "GET", name: "District Matrix" },
  { path: "/api/government/districts/priority", method: "GET", name: "District Priority Ranking" },
  { path: "/api/government/districts/dist-pune/action-plan", method: "GET", name: "District Action Plan (Pune)" },
  { path: "/api/government/skills/priorities", method: "GET", name: "Skill Priorities" },
  { path: "/api/government/programs", method: "GET", name: "Government Programs" },
  { path: "/api/government/programs/prog-pmkvy-4", method: "GET", name: "Program Detail (PMKVY 4.0)" },
  { path: "/api/government/interventions", method: "GET", name: "Interventions List" },
  { path: "/api/government/budget", method: "GET", name: "Budget Allocations" },
  { path: "/api/government/budget/outcome-analysis", method: "GET", name: "Budget Outcome Analysis" },
  { path: "/api/government/scenarios/simulate", method: "GET", name: "Saved Scenarios" },
  { path: "/api/government/risks", method: "GET", name: "District Risks" },
  { path: "/api/government/alerts", method: "GET", name: "Early Warning Alerts" },
  { path: "/api/government/clusters", method: "GET", name: "Industrial Clusters" },
  { path: "/api/government/mobility", method: "GET", name: "Policy Mobility Intelligence" },
  { path: "/api/government/data-quality", method: "GET", name: "Data Quality Scorecard" },
  {
    path: "/api/government/scenarios/simulate",
    method: "POST",
    name: "Run Scenario Simulation",
    body: {
      scenarioTitle: "Test Validation Simulation",
      geographyScope: "DISTRICT",
      stateCode: "MH",
      targetSkillId: "skill-bms",
      adjustments: { trainingSeatCapacityDeltaPercent: 20 },
    },
  },
  {
    path: "/api/government/copilot/chat",
    method: "POST",
    name: "AI Policy Copilot Chat",
    body: { query: "What are the largest skill shortages nationally?" },
  },
  {
    path: "/api/government/reports/generate",
    method: "POST",
    name: "Generate Policy Report",
    body: { reportType: "DISTRICT_SKILL_GAP", stateCode: "MH" },
  },
];

function makeRequest(ep) {
  return new Promise((resolve) => {
    const url = new URL(ep.path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: ep.method,
      headers: {
        "Content-Type": "application/json",
        "x-user-role": "NATIONAL_GOVERNMENT",
        "x-user-name": "Validator Script",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({
            name: ep.name,
            path: ep.path,
            status: res.statusCode,
            success: json.success,
            error: json.error,
          });
        } catch (e) {
          resolve({
            name: ep.name,
            path: ep.path,
            status: res.statusCode,
            success: false,
            error: "Failed to parse JSON response: " + data.substring(0, 100),
          });
        }
      });
    });

    req.on("error", (e) => {
      resolve({
        name: ep.name,
        path: ep.path,
        status: 0,
        success: false,
        error: e.message,
      });
    });

    if (ep.body) {
      req.write(JSON.stringify(ep.body));
    }
    req.end();
  });
}

async function runValidation() {
  console.log("==================================================");
  console.log("CAREERIS GOVERNMENT INTELLIGENCE API VALIDATION");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    const result = await makeRequest(ep);
    if (result.status === 200 && result.success) {
      console.log(`[PASS] ${result.name} (${result.path}) -> HTTP ${result.status}`);
      passed++;
    } else {
      console.error(`[FAIL] ${result.name} (${result.path}) -> HTTP ${result.status}: ${result.error}`);
      failed++;
    }
  }

  console.log("\n==================================================");
  console.log(`Validation Results: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runValidation();
