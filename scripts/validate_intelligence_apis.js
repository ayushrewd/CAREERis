const http = require("http");

async function fetchJson(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path,
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": options.role || "PLATFORM_ADMIN",
          "x-user-id": "usr-admin-01",
          ...(options.headers || {}),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on("error", reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runValidation() {
  console.log("============================================================");
  console.log("CAREERIS LABOUR-MARKET INTELLIGENCE API VALIDATION SUITE");
  console.log("============================================================\n");

  const endpoints = [
    { name: "Overview Pan-India", path: "/api/intelligence/overview" },
    { name: "Overview Maharashtra Drilldown", path: "/api/intelligence/overview?stateCode=MH" },
    { name: "Skills Intelligence List", path: "/api/intelligence/skills" },
    { name: "Skill Detail Intelligence (BMS)", path: "/api/intelligence/skills/skill-bms" },
    { name: "Skill Historical Trend (BMS)", path: "/api/intelligence/skills/skill-bms/trend" },
    { name: "Skill Demand Aggregation (BMS)", path: "/api/intelligence/skills/skill-bms/demand" },
    { name: "Skill 6-Tier Supply (BMS)", path: "/api/intelligence/skills/skill-bms/supply" },
    { name: "Skill Net Deficit & Gap (BMS)", path: "/api/intelligence/skills/skill-bms/gap" },
    { name: "Skill Geographic Distribution (BMS)", path: "/api/intelligence/skills/skill-bms/geography" },
    { name: "Emerging Skills & Candidates", path: "/api/intelligence/emerging-skills" },
    { name: "Roles Intelligence List", path: "/api/intelligence/roles" },
    { name: "Role Detail Intelligence", path: "/api/intelligence/roles/role-bms-lead" },
    { name: "Industries Taxonomy List", path: "/api/intelligence/industries" },
    { name: "Industry Detail Intelligence (Auto EV)", path: "/api/intelligence/industries/ind-auto-ev" },
    { name: "State Intelligence Profile (MH)", path: "/api/intelligence/states/MH" },
    { name: "District Intelligence Profile (Pune)", path: "/api/intelligence/districts/dist-mh-pun" },
    { name: "Industrial Cluster Intelligence", path: "/api/intelligence/clusters/cluster-chakan" },
    { name: "Competency Comparison (BMS vs PLC)", path: "/api/intelligence/compare?type=SKILL_VS_SKILL&idA=skill-bms&idB=skill-plc" },
    { name: "Active Policy Alerts", path: "/api/intelligence/alerts" },
    { name: "Admin Data Sources Registry", path: "/api/admin/intelligence/sources" },
    { name: "Admin Ingestion Job History", path: "/api/admin/intelligence/ingestion" },
    { name: "Admin Data Quality Diagnostics", path: "/api/admin/intelligence/quality" },
  ];

  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    try {
      const res = await fetchJson(ep.path);
      if (res.status === 200 && res.data && res.data.success) {
        console.log(`[PASS] ${ep.name} -> ${ep.path} (HTTP 200)`);
        passed++;
      } else {
        console.error(`[FAIL] ${ep.name} -> ${ep.path} (HTTP ${res.status}):`, res.data || res.raw);
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${ep.name} -> ${ep.path}:`, err.message);
      failed++;
    }
  }

  // Test Post Ingestion Job
  try {
    const ingestPost = await fetchJson("/api/admin/intelligence/ingestion", {
      method: "POST",
      body: { sourceId: "src-msde-ncvt" },
    });
    if (ingestPost.status === 200 && ingestPost.data?.success) {
      console.log(`[PASS] Admin Trigger Ingestion Pipeline -> POST /api/admin/intelligence/ingestion (HTTP 200)`);
      passed++;
    } else {
      console.error(`[FAIL] Admin Trigger Ingestion Pipeline:`, ingestPost.data);
      failed++;
    }
  } catch (e) {
    console.error(`[ERROR] Admin Trigger Ingestion:`, e.message);
    failed++;
  }

  console.log("\n============================================================");
  console.log(`TOTAL VALIDATION RESULTS: ${passed}/${passed + failed} PASSED (${failed} FAILED)`);
  console.log("============================================================\n");

  if (failed > 0) process.exit(1);
}

runValidation();
