// ==============================================================================
// CAREERIS TRAINING INTELLIGENCE API VALIDATION SUITE
// Automated HTTP verification of all 18 Master Prompt 09 REST endpoints
// ==============================================================================

const http = require("http");

const BASE_URL = "http://localhost:3000";

const ENDPOINTS_TO_TEST = [
  { name: "Training Overview Dashboard", method: "GET", path: "/api/training/dashboard" },
  { name: "Institutes Directory", method: "GET", path: "/api/training/institutes" },
  { name: "Institute by ID", method: "GET", path: "/api/training/institutes/inst-iti-aundh-pune" },
  { name: "Institute Scorecard", method: "GET", path: "/api/training/institutes/inst-iti-aundh-pune/scorecard" },
  { name: "Training Courses List", method: "GET", path: "/api/training/courses" },
  { name: "Course Health Evaluation", method: "GET", path: "/api/training/courses/course-bms-lead-01/health" },
  { name: "Curriculum Modules", method: "GET", path: "/api/training/curriculum?courseId=course-bms-lead-01" },
  { name: "Curriculum Gap Analysis", method: "GET", path: "/api/training/curriculum/gap-analysis?courseId=course-bms-lead-01" },
  { name: "Trainer Directory", method: "GET", path: "/api/training/trainers" },
  { name: "Trainer Retraining Pathway", method: "GET", path: "/api/training/trainers/tr-mahesh-02/retraining-path" },
  { name: "Labs List", method: "GET", path: "/api/training/labs" },
  { name: "Equipment Inventory", method: "GET", path: "/api/training/equipment" },
  { name: "Training Capacity Overview", method: "GET", path: "/api/training/capacity" },
  { name: "Training Funnel Metrics", method: "GET", path: "/api/training/funnel" },
  { name: "Training Market Fit Outcomes", method: "GET", path: "/api/training/outcomes" },
  { name: "District Training Plan", method: "GET", path: "/api/training/plans/district/dist-pune" },
  { name: "State Training Plan", method: "GET", path: "/api/training/plans/state/MH" },
  { name: "National Training Plan", method: "GET", path: "/api/training/plans/national" },
  { name: "Action Center Items", method: "GET", path: "/api/training/actions" },
];

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS — TRAINING INTELLIGENCE API VALIDATION SUITE");
  console.log("============================================================\n");

  let passed = 0;
  let failed = 0;

  for (const ep of ENDPOINTS_TO_TEST) {
    try {
      const res = await fetch(`${BASE_URL}${ep.path}`, {
        method: ep.method,
        headers: {
          "x-user-role": "TRAINING_PROVIDER",
          "x-user-name": "Dr. Anand Joshi",
        },
      });

      if (res.status === 200) {
        const json = await res.json();
        if (json.success) {
          console.log(`[PASS] [${res.status}] ${ep.name} -> ${ep.path}`);
          passed++;
        } else {
          console.error(`[FAIL] [${res.status}] ${ep.name} -> ${ep.path} (success: false)`);
          failed++;
        }
      } else {
        console.error(`[FAIL] [${res.status}] ${ep.name} -> ${ep.path}`);
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${ep.name} -> ${ep.path}: ${err.message}`);
      failed++;
    }
  }

  // POST endpoint: Equipment Simulator
  try {
    const res = await fetch(`${BASE_URL}/api/training/equipment/simulate-failure`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-role": "TRAINING_PROVIDER" },
      body: JSON.stringify({ equipmentId: "eq-bms-test-rig-01" }),
    });
    const json = await res.json();
    if (res.status === 200 && json.success && json.data.label === "SIMULATION") {
      console.log(`[PASS] [200] Equipment Failure Simulator (POST) -> /api/training/equipment/simulate-failure`);
      passed++;
    } else {
      console.error(`[FAIL] Equipment Failure Simulator`);
      failed++;
    }
  } catch (err) {
    console.error(`[ERROR] Equipment Simulator: ${err.message}`);
    failed++;
  }

  // POST endpoint: Capacity Scenario
  try {
    const res = await fetch(`${BASE_URL}/api/training/capacity/scenarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-role": "TRAINING_PROVIDER" },
      body: JSON.stringify({ deltaPercentage: 25, targetSkillId: "Battery Management Systems (BMS)" }),
    });
    const json = await res.json();
    if (res.status === 200 && json.success && json.data.label === "SIMULATION") {
      console.log(`[PASS] [200] Capacity Scenario Simulator (POST) -> /api/training/capacity/scenarios`);
      passed++;
    } else {
      console.error(`[FAIL] Capacity Scenario Simulator`);
      failed++;
    }
  } catch (err) {
    console.error(`[ERROR] Capacity Simulator: ${err.message}`);
    failed++;
  }

  // POST endpoint: Training Copilot
  try {
    const res = await fetch(`${BASE_URL}/api/training/copilot/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-role": "TRAINING_PROVIDER" },
      body: JSON.stringify({ query: "Which courses should we expand?" }),
    });
    const json = await res.json();
    if (res.status === 200 && json.success && json.data.groundingLabel) {
      console.log(`[PASS] [200] Training Copilot Chat (POST) -> /api/training/copilot/chat [${json.data.groundingLabel}]`);
      passed++;
    } else {
      console.error(`[FAIL] Training Copilot Chat`);
      failed++;
    }
  } catch (err) {
    console.error(`[ERROR] Training Copilot Chat: ${err.message}`);
    failed++;
  }

  console.log("\n============================================================");
  console.log(`VALIDATION RESULT: ${passed} Passed, ${failed} Failed out of ${passed + failed} Endpoints`);
  console.log("============================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runValidation();
