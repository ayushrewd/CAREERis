const http = require("http");

const BASE_URL = "http://localhost:3000";

function makeRequest(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "user-cand-01",
        "x-user-role": "PLATFORM_ADMIN",
        ...(options.headers || {}),
      },
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on("error", reject);
    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runValidation() {
  console.log("=================================================");
  console.log("CAREERIS — SKILL GRAPH & INTELLIGENCE API CHECKS");
  console.log("=================================================");

  const checks = [
    { name: "Health Endpoint", path: "/api/health" },
    { name: "List Canonical Skills", path: "/api/skills" },
    {
      name: "Skill Normalization Engine (POST)",
      path: "/api/skills",
      options: { method: "POST" },
      body: { action: "normalize", rawText: "Python programming" },
    },
    { name: "Canonical Skill Dossier (/api/skills/skill-bms)", path: "/api/skills/skill-bms" },
    { name: "Skill Graph Traversal (/api/skills/skill-bms/graph)", path: "/api/skills/skill-bms/graph" },
    { name: "Skill Market Intelligence (/api/skills/skill-bms/market)", path: "/api/skills/skill-bms/market" },
    { name: "Connected Roles (/api/skills/skill-bms/roles)", path: "/api/skills/skill-bms/roles" },
    { name: "Connected Jobs (/api/skills/skill-bms/jobs)", path: "/api/skills/skill-bms/jobs" },
    { name: "Connected Courses (/api/skills/skill-bms/courses)", path: "/api/skills/skill-bms/courses" },
    { name: "Connected Assessments (/api/skills/skill-bms/assessments)", path: "/api/skills/skill-bms/assessments" },
    {
      name: "Deterministic Skill Gap Analysis (POST)",
      path: "/api/skills/gap-analysis",
      options: { method: "POST" },
      body: { roleId: "role-bms-lead" },
    },
    { name: "Job Recommendations (/api/recommendations/jobs)", path: "/api/recommendations/jobs" },
    { name: "Course Recommendations (/api/recommendations/courses)", path: "/api/recommendations/courses" },
    { name: "CareerIS Recommended Learning Path", path: "/api/recommendations/learning-path?roleId=role-bms-lead" },
    {
      name: "Employer Candidate Matching (POST)",
      path: "/api/recommendations/candidates",
      options: { method: "POST" },
      body: { jobId: "job-01" },
    },
    { name: "Admin Canonical Registry (/api/admin/skills)", path: "/api/admin/skills" },
    { name: "Admin Unresolved Quarantine (/api/admin/skills/unresolved)", path: "/api/admin/skills/unresolved" },
    {
      name: "Admin Pre-Merge Impact Preview (POST)",
      path: "/api/admin/skills/merge",
      options: { method: "POST" },
      body: { primarySkillId: "skill-py", secondarySkillId: "skill-sql", action: "preview" },
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      const res = await makeRequest(check.path, check.options, check.body);
      if (res.status >= 200 && res.status < 300) {
        console.log(`[PASS] ${check.name} (Status: ${res.status})`);
        passed++;
      } else {
        console.error(`[FAIL] ${check.name} (Status: ${res.status})`, res.data);
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${check.name} - Connection error: ${err.message}`);
      failed++;
    }
  }

  console.log("=================================================");
  console.log(`RESULTS: ${passed}/${checks.length} checks passed, ${failed} failed.`);
  console.log("=================================================");

  if (failed > 0) process.exit(1);
}

runValidation();
