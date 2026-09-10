// ==============================================================================
// CAREERIS EMPLOYER RECRUITMENT PAGES HTML RENDERING VERIFICATION SCRIPT
// ==============================================================================

const http = require("http");

const pages = [
  "/employer",
  "/employer/profile",
  "/employer/organization",
  "/employer/jobs",
  "/employer/jobs/new",
  "/employer/jobs/req-tata-ev-01",
  "/employer/jobs/req-tata-ev-01/pipeline",
  "/employer/talent",
  "/employer/talent-pools",
  "/employer/candidates",
  "/employer/interviews",
  "/employer/offers",
  "/employer/workforce",
  "/employer/reskilling",
  "/employer/partnerships",
  "/employer/training-requests",
  "/employer/feedback",
  "/employer/surveys",
  "/employer/analytics",
  "/employer/copilot",
];

async function verifyEmployerPages() {
  console.log("============================================================");
  console.log("CAREERIS EMPLOYER RECRUITMENT PAGES HTML RENDERING VERIFICATION");
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
