// ==============================================================================
// CAREERIS TRAINING PAGES HTML RENDERING VERIFICATION SCRIPT
// ==============================================================================

const http = require("http");

const pages = [
  "/courses",
  "/courses/crs-ev-bms-01",
  "/training-provider",
  "/training-provider/profile",
  "/training-provider/curriculum",
  "/training-provider/trainers",
  "/training-provider/equipment",
  "/training-provider/course-health",
  "/candidate/learning",
  "/candidate/skills",
  "/candidate/credentials",
  "/candidate/assessments",
  "/employer/training-requests",
  "/government/training",
];

async function verifyTrainingPages() {
  console.log("============================================================");
  console.log("CAREERIS TRAINING PAGES HTML RENDERING VERIFICATION");
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
  console.log(`TRAINING PAGES RESULT: ${passed} Passed, ${failed} Failed out of ${pages.length} Pages`);
  console.log("============================================================\n");

  if (failed > 0) process.exit(1);
}

verifyTrainingPages();
