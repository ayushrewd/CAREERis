// ==============================================================================
// CAREERIS EMPLOYER INTELLIGENCE & HIRING OS API VALIDATION SCRIPT
// Validates all Master Prompt 14 Endpoints
// ==============================================================================

const http = require("http");

const BASE_URL = "http://localhost:3000";

const endpoints = [
  { name: "Talent Pools (GET)", path: "/api/v1/employer/talent-pools", method: "GET" },
  {
    name: "Create Talent Pool (POST)",
    path: "/api/v1/employer/talent-pools",
    method: "POST",
    body: JSON.stringify({ name: "Solar PV Technicians", tags: ["Solar", "Renewable"] }),
  },
  { name: "Workforce Forecasts (GET)", path: "/api/v1/employer/workforce/forecasts", method: "GET" },
  { name: "Workforce Scenarios (GET)", path: "/api/v1/employer/workforce/scenarios", method: "GET" },
  { name: "Reskilling Pathways (GET)", path: "/api/v1/employer/reskilling", method: "GET" },
  { name: "Training Partners (GET)", path: "/api/v1/employer/training-partners", method: "GET" },
  { name: "Employer Surveys (GET)", path: "/api/v1/employer/surveys", method: "GET" },
  {
    name: "Submit Employer Survey (POST)",
    path: "/api/v1/employer/surveys",
    method: "POST",
    body: JSON.stringify({ respondentName: "Plant TA Head", satisfactionWithLocalGraduatesScore: 4.8 }),
  },
  { name: "Placement Feedback (GET)", path: "/api/v1/employer/feedback", method: "GET" },
  {
    name: "Submit Placement Feedback (POST)",
    path: "/api/v1/employer/feedback",
    method: "POST",
    body: JSON.stringify({ candidateId: "cand-rohit-01", technicalReadinessScore: 5 }),
  },
  { name: "Industry Benchmarks (GET)", path: "/api/v1/employer/benchmarks", method: "GET" },
  {
    name: "Employer Copilot Advisor (POST)",
    path: "/api/v1/employer/copilot",
    method: "POST",
    body: JSON.stringify({ query: "Which skills are hardest to hire?" }),
  },
];

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS — EMPLOYER TALENT INTELLIGENCE API VALIDATION SUITE");
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
