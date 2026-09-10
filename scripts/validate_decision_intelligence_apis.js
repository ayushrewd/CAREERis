const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS LABOUR-MARKET DECISION INTELLIGENCE API VALIDATION");
  console.log("============================================================\n");

  const tests = [
    { name: "Course Health Evaluation (BMS)", url: "/api/intelligence/courses/course-bms-01/health", method: "GET" },
    { name: "Course Obsolescence Detection (BMS)", url: "/api/intelligence/courses/course-bms-01/obsolescence", method: "GET" },
    { name: "Course Oversupply Evaluation (BMS)", url: "/api/intelligence/courses/course-bms-01/oversupply", method: "GET" },
    { name: "Course Modular Curriculum Coverage", url: "/api/intelligence/courses/course-bms-01/curriculum", method: "GET" },
    { name: "Course Assigned Faculty Trainers", url: "/api/intelligence/courses/course-bms-01/trainers", method: "GET" },
    { name: "Course Lab Equipment Gap Diagnostics", url: "/api/intelligence/courses/course-bms-01/equipment", method: "GET" },
    { name: "Global Trainer Competency Gaps", url: "/api/intelligence/trainers/gaps", method: "GET" },
    { name: "Global Lab Equipment Gaps", url: "/api/intelligence/equipment/gaps", method: "GET" },
    { name: "Global Curriculum Gaps", url: "/api/intelligence/curriculum/gaps", method: "GET" },
    { name: "Global Course Oversupply Radar", url: "/api/intelligence/oversupply", method: "GET" },
    { name: "Global Obsolescence Risk Radar", url: "/api/intelligence/obsolescence", method: "GET" },
    { name: "Spatial Training Access Deserts", url: "/api/intelligence/access-gaps?stateCode=MH", method: "GET" },
    { name: "District Action Plan & Profile (Pune)", url: "/api/intelligence/districts/dist-mh-pun/action-plan", method: "GET" },
    { name: "Government Interventions Registry", url: "/api/intelligence/interventions", method: "GET" },
    { name: "Intervention Detail & Outcome Tracking", url: "/api/intelligence/interventions/int-pun-bms-expand", method: "GET" },
    {
      name: "Decision Scenario Simulator",
      url: "/api/intelligence/scenarios",
      method: "POST",
      body: { scenarioType: "SEAT_CAPACITY_CHANGE", targetSkillId: "skill-bms", changePercentage: 20 },
    },
    { name: "Multi-Source Labour Evidence & Conflict", url: "/api/intelligence/evidence?skillId=skill-bms", method: "GET" },
    { name: "Employer Demand Signals Registry", url: "/api/intelligence/employer-signals", method: "GET" },
    { name: "Strategic Skill Prioritization", url: "/api/intelligence/skills/priorities", method: "GET" },
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const opts = {
        method: t.method,
        headers: { "Content-Type": "application/json" },
      };
      if (t.body) opts.body = JSON.stringify(t.body);

      const res = await fetch(`${BASE_URL}${t.url}`, opts);
      if (res.status === 200) {
        const data = await res.json();
        if (data.success !== false) {
          console.log(`[PASS] ${t.name} -> ${t.method} ${t.url} (HTTP 200)`);
          passed++;
        } else {
          console.error(`[FAIL] ${t.name} -> ${t.url} returned success: false:`, data.error);
          failed++;
        }
      } else {
        console.error(`[FAIL] ${t.name} -> ${t.url} returned HTTP ${res.status}`);
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${t.name} -> ${t.url}: ${err.message}`);
      failed++;
    }
  }

  console.log("\n============================================================");
  console.log(`DECISION INTELLIGENCE VALIDATION: ${passed}/${tests.length} PASSED (${failed} FAILED)`);
  console.log("============================================================\n");

  if (failed > 0) process.exit(1);
}

runValidation();
