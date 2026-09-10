// ==============================================================================
// CAREERIS UI HTML RENDERING VERIFICATION SCRIPT
// ==============================================================================

const http = require("http");

const pages = [
  "/government/command-center",
  "/government/programmes",
  "/government/programmes/prog-pmkvy-ev-01",
  "/government/programmes/prog-pmkvy-ev-01/theory-of-change",
  "/government/programmes/prog-pmkvy-ev-01/evaluation",
  "/government/budgets",
  "/government/district-performance",
  "/government/state-performance",
  "/government/national-performance",
  "/government/interventions/board",
  "/government/decisions",
  "/government/risks",
  "/government/esg",
];

async function verifyPages() {
  console.log("============================================================");
  console.log("CAREERIS UI PAGES HTML RENDERING VERIFICATION");
  console.log("============================================================\n");

  let passed = 0;
  let failed = 0;

  for (const p of pages) {
    try {
      const res = await fetch(`http://localhost:3000${p}`);
      if (res.status === 200) {
        const text = await res.text();
        if (text.length > 500) {
          console.log(`[PASS] [200 OK] (${(text.length / 1024).toFixed(1)} KB) -> ${p}`);
          passed++;
        } else {
          console.log(`[WARN] [200 OK but small payload] -> ${p}`);
          passed++;
        }
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
  console.log(`UI VERIFICATION RESULT: ${passed} Passed, ${failed} Failed out of ${pages.length} Pages`);
  console.log("============================================================\n");

  if (failed > 0) process.exit(1);
}

verifyPages();
