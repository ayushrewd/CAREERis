const http = require("http");

const BASE_URL = "http://localhost:3001";

async function makeRequest(path, method = "GET", body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on("error", (e) => reject(e));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runValidation() {
  console.log("🚀 Starting CareerIS End-to-End API Integration Suite...\n");

  const endpoints = [
    { name: "Health Check API", path: "/api/health" },
    { name: "Jobs List API", path: "/api/jobs" },
    { name: "Job Detail API", path: "/api/jobs/job-01" },
    { name: "Candidate Me API", path: "/api/candidates/me" },
    { name: "Candidate Skills API", path: "/api/candidates/me/skills" },
    { name: "Assessments Catalog API", path: "/api/assessments" },
    { name: "Skills Taxonomy API", path: "/api/skills" },
    { name: "Skill Detail API", path: "/api/skills/skill-bms" },
    { name: "Courses Catalog API", path: "/api/courses" },
    { name: "Employers Directory API", path: "/api/employers" },
    { name: "Training Providers API", path: "/api/training-providers" },
    { name: "Government Overview API", path: "/api/government/overview" },
    { name: "Government States API", path: "/api/government/states" },
    { name: "Government Districts API", path: "/api/government/districts" },
    { name: "Government Skill Gaps API", path: "/api/government/skill-gaps" },
    { name: "Government Emerging Skills API", path: "/api/government/emerging-skills" },
    { name: "Government District Plans API", path: "/api/government/district-plans" },
    { name: "Notifications API", path: "/api/notifications" },
    { name: "Conversations API", path: "/api/conversations" },
    { name: "Audit Logs API", path: "/api/audit" },
    { name: "Global Spotlight Search API", path: "/api/search?q=Pune" },
  ];

  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    try {
      const res = await makeRequest(ep.path);
      if (res.status === 200 && (res.data?.success === true || res.data?.data)) {
        console.log(`✅ [PASS] ${ep.name.padEnd(35)} (HTTP 200, success=true)`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${ep.name.padEnd(35)} Status: ${res.status}`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERR]  ${ep.name.padEnd(35)} ${err.message}`);
      failed++;
    }
  }

  // Test Transactional Application Submission
  console.log("\nTesting Transactional Workflows:");
  try {
    const appRes = await makeRequest("/api/applications", "POST", {
      jobId: "job-02",
      coverNote: "Experienced in industrial PLC programming and Siemens TIA Portal.",
    });
    if (appRes.status === 201 && appRes.data?.success === true) {
      console.log(`✅ [PASS] Transactional Application Submission (HTTP 201, ID: ${appRes.data.data.id})`);
      passed++;
    } else {
      console.error(`❌ [FAIL] Application Submission:`, appRes);
      failed++;
    }
  } catch (err) {
    console.error(`❌ [ERR]  Application Submission:`, err.message);
    failed++;
  }

  // Test Assessment Submission & Skill Passport Badge Attestation
  try {
    const asmtListRes = await makeRequest("/api/assessments");
    const asmt = asmtListRes.data?.data?.[0];
    const answers = {};
    if (asmt && asmt.questions) {
      asmt.questions.forEach((q) => {
        answers[q.id] = q.correctOptionIndex !== undefined ? q.correctOptionIndex : 1;
      });
    }

    const asmtRes = await makeRequest("/api/assessments/submit", "POST", {
      assessmentId: asmt ? asmt.id : "asmt-bms-01",
      answers,
    });
    if ((asmtRes.status === 200 || asmtRes.status === 201) && asmtRes.data?.success === true) {
      console.log(`✅ [PASS] Assessment Grading & Badge Attestation (Score: ${asmtRes.data.data.score}%, Level: ${asmtRes.data.data.proficiencyGranted})`);
      passed++;
    } else {
      console.error(`❌ [FAIL] Assessment Submission:`, asmtRes);
      failed++;
    }
  } catch (err) {
    console.error(`❌ [ERR]  Assessment Submission:`, err.message);
    failed++;
  }

  // Test Candidate Profile Patch
  try {
    const profileRes = await makeRequest("/api/candidates/me", "PATCH", {
      headline: "Senior Battery Systems & PLC Engineer",
    });
    if (profileRes.status === 200 && profileRes.data?.success === true) {
      console.log(`✅ [PASS] Candidate Profile Update (HTTP 200, Headline: "${profileRes.data.data.headline}")`);
      passed++;
    } else {
      console.error(`❌ [FAIL] Profile Update:`, profileRes);
      failed++;
    }
  } catch (err) {
    console.error(`❌ [ERR]  Profile Update:`, err.message);
    failed++;
  }

  console.log(`\n============================================================`);
  console.log(`🎯 End-to-End API Integration Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log(`============================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runValidation();
