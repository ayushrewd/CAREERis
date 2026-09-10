// ==============================================================================
// CAREERIS TRAINING ECOSYSTEM & LEARNING MARKETPLACE API VALIDATION SCRIPT
// Validates all Master Prompt 15 Endpoints
// ==============================================================================

const http = require("http");

const BASE_URL = "http://localhost:3000";

const endpoints = [
  { name: "Courses List (GET)", path: "/api/v1/courses", method: "GET" },
  { name: "Course By ID (GET)", path: "/api/v1/courses/crs-ev-bms-01", method: "GET" },
  { name: "Course Curriculum (GET)", path: "/api/v1/courses/crs-ev-bms-01/curriculum", method: "GET" },
  { name: "Course Health (GET)", path: "/api/v1/courses/crs-ev-bms-01/health", method: "GET" },
  { name: "Training Providers (GET)", path: "/api/v1/training-providers", method: "GET" },
  { name: "Enrollments (GET)", path: "/api/v1/enrollments", method: "GET" },
  {
    name: "Create Enrollment (POST)",
    path: "/api/v1/enrollments",
    method: "POST",
    body: JSON.stringify({ courseId: "crs-ev-bms-01", courseTitle: "EV Battery Diagnostics", batchId: "batch-bms-2026-01" }),
  },
  { name: "Assessments Question Bank (GET)", path: "/api/v1/assessments", method: "GET" },
  { name: "Assessment Attempts (GET)", path: "/api/v1/assessments/assess-asdc-bms-2026/attempts", method: "GET" },
  {
    name: "Submit Assessment Attempt (POST)",
    path: "/api/v1/assessments/assess-asdc-bms-2026/attempts",
    method: "POST",
    body: JSON.stringify({ scorePercentage: 94 }),
  },
  { name: "Training Requests (GET)", path: "/api/v1/training-requests", method: "GET" },
  {
    name: "Create Training Request (POST)",
    path: "/api/v1/training-requests",
    method: "POST",
    body: JSON.stringify({ roleTargetTitle: "Solar PV Specialist", headcountNeeded: 20 }),
  },
  {
    name: "AI Learning Advisor (POST)",
    path: "/api/v1/learning/advisor",
    method: "POST",
    body: JSON.stringify({ query: "Which course will help me become a BMS technician?" }),
  },
];

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS — TRAINING ECOSYSTEM API VALIDATION SUITE");
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
