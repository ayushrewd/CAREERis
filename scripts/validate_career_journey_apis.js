const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS CAREER JOURNEY & EMPLOYMENT EXECUTION API VALIDATION");
  console.log("============================================================\n");

  const tests = [
    { name: "Candidate Profile & Completeness", url: "/api/candidate/profile", method: "GET" },
    { name: "Candidate Multi-Career Goals", url: "/api/candidate/goals", method: "GET" },
    { name: "7-Factor Career Readiness Diagnostics", url: "/api/candidate/readiness", method: "GET" },
    { name: "Explainable Career Discovery", url: "/api/candidate/discover", method: "GET" },
    { name: "Career Transition Bridge Analysis", url: "/api/candidate/transitions?toRoleId=role-bms-lead", method: "GET" },
    { name: "Prioritized Missing Skills Ranking", url: "/api/candidate/skills/prioritized", method: "GET" },
    { name: "Personalized Milestone Learning Path", url: "/api/candidate/learning-path", method: "GET" },
    { name: "Capstone Practical Projects", url: "/api/candidate/projects", method: "GET" },
    { name: "Personalized Recommended Jobs", url: "/api/candidate/jobs/recommended", method: "GET" },
    {
      name: "Job Match Improvement Simulator",
      url: "/api/candidate/jobs/job-01/simulate",
      method: "POST",
      body: { skillId: "skill-ros", proficiency: "ADVANCED" },
    },
    { name: "Candidate Applications Lifecycle", url: "/api/candidate/applications", method: "GET" },
    { name: "Application Performance Analytics", url: "/api/candidate/analytics", method: "GET" },
    { name: "Verified Skill Passport Credentials", url: "/api/candidate/skill-passport", method: "GET" },
    { name: "Chronological Career Timeline", url: "/api/candidate/timeline", method: "GET" },
    { name: "Career Goal Progress Velocity", url: "/api/candidate/progress", method: "GET" },
    { name: "Personalized Labour-Market Signals", url: "/api/candidate/market-signals", method: "GET" },
    { name: "Target Regional Hiring Employers", url: "/api/candidate/employers", method: "GET" },
    { name: "Comprehensive Action Plan", url: "/api/candidate/action-plan", method: "GET" },
    {
      name: "Grounded AI Career Copilot Chat",
      url: "/api/candidate/copilot/chat",
      method: "POST",
      body: { message: "What skill should I learn next?" },
    },
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
  console.log(`CAREER JOURNEY VALIDATION: ${passed}/${tests.length} PASSED (${failed} FAILED)`);
  console.log("============================================================\n");

  if (failed > 0) process.exit(1);
}

runValidation();
