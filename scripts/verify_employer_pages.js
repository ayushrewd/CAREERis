// ==============================================================================
// CAREERIS EMPLOYER PAGES HTML RENDERING VERIFICATION SCRIPT
// ==============================================================================

const http = require("http");

const pages = [
  "/employer",
  "/employer/profile",
  "/employer/organization",
  "/employer/workforce",
  "/employer/workforce/planning",
  "/employer/workforce/scenarios",
  "/employer/jobs",
  "/employer/jobs/new",
  "/employer/candidates",
  "/employer/talent-pools",
  "/employer/interviews",
  "/employer/offers",
  "/employer/analytics",
  "/employer/skills",
  "/employer/reskilling",
  "/employer/partnerships",
  "/employer/surveys",
  "/employer/feedback",
  "/employer/copilot",
];

async function verifyEmployerPages() {
  console.log("============================================================");
  console.log("CAREERIS EMPLOYER PAGES HTML RENDERING VERIFICATION");
  console.log("============================================================\n");

  let passed = 0;
  let failed = 0;

  for (const p of pages) {
    try {
      const res = await fetch(`http://localhost:3000${p}`);
      if (res.status === 200) {
        const text = await res.text();
        console.log(`[PASS] [200 OK] (${(text.length / 1024).toFixed(1)} KB) -> ${p}`);
        passed++;
      } else {
        console.error(`[FAIL] [${res.status}] -> ${p}`);
        failed++;
      }
    } catch (e) {
      console.error(`[ERROR] ${p} -> ${e.message}`);
      failed++;
    }
  }

  console.log("\n============================================================");
  console.log(`EMPLOYER PAGES RESULT: ${passed} Passed, ${failed} Failed out of ${pages.length} Pages`);
  console.log("============================================================\n");

  if (failed > 0) process.exit(1);
}

verifyEmployerPages();
