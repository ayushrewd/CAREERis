const BASE_URL = "http://localhost:3000";

async function main() {
  console.log("==> Running Career Goal Role Evidence & Diagnostic Verification <==");

  // Register a candidate with targetRole: "AIML ENGINEER"
  const candidateEmail = `candidate-aiml-${Date.now()}@example.invalid`;
  const password = "TestPassword#2026";
  console.log(`[verify] Registering test candidate: ${candidateEmail}...`);

  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Mayank Sharma",
      email: candidateEmail,
      password,
      roleType: "CANDIDATE",
      location: "Pune, Maharashtra",
      education: "Government College of Engineering",
      qualification: "B.Tech Computer Science",
      experience: "Fresher",
      currentSkills: ["Python", "Machine Learning"],
      targetRole: "AIML ENGINEER",
    }),
  });

  const regData = await regRes.json();
  if (!regRes.ok) throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
  const sessionCookie = regRes.headers.get("set-cookie")?.split(";", 1)[0];
  if (!sessionCookie) throw new Error("No session cookie returned from registration.");

  const headers = {
    "Content-Type": "application/json",
    Cookie: sessionCookie,
  };

  console.log(`✓ Candidate registered: ${regData.user.fullName} (${regData.user.email})`);

  // Test 1: Search "AIMLENGINEER" (exact test from the user's screenshot!)
  console.log("\n[Test 1] Searching with 'AIMLENGINEER' (matches user query)...");
  const res1 = await fetch(`${BASE_URL}/api/candidate/role-evidence?q=AIMLENGINEER`, { headers });
  const data1 = await res1.json();
  if (!res1.ok) throw new Error(`Search failed: ${JSON.stringify(data1)}`);
  console.log(`[Test 1] Status: ${res1.status}, Roles found: ${data1.roles?.length || 0}`);
  const aimlRole = data1.roles?.find((r) => r.title.toLowerCase().includes("ai/ml") || r.title.toLowerCase().includes("aiml"));
  if (!aimlRole) {
    throw new Error(`Expected 'AI/ML Engineer' in search results for 'AIMLENGINEER', got: ${JSON.stringify(data1.roles)}`);
  }
  console.log(`✓ Found matching role: "${aimlRole.title}"`);
  console.log(`   - Sector: ${aimlRole.sector}`);
  console.log(`   - Active postings: ${aimlRole.activePostings}`);
  console.log(`   - Connected employers: ${aimlRole.employers.join(", ")}`);

  // Test 2: Search variations "aiml", "bms", "plc", "data analyst"
  console.log("\n[Test 2] Testing query normalization variations...");
  for (const q of ["aiml", "AI / ML", "bms", "plc", "data analyst"]) {
    const res = await fetch(`${BASE_URL}/api/candidate/role-evidence?q=${encodeURIComponent(q)}`, { headers });
    const data = await res.json();
    if (!res.ok || !data.roles || data.roles.length === 0) {
      throw new Error(`Query '${q}' returned no roles!`);
    }
    console.log(`✓ Query '${q}' -> matched "${data.roles[0].title}" (${data.roles.length} match(es))`);
  }

  // Test 3: Initial load without query (testing auto-resolution of profile.targetRole: "AIML ENGINEER")
  console.log("\n[Test 3] Loading initial role evidence without query (auto-resolve)...");
  const res3 = await fetch(`${BASE_URL}/api/candidate/role-evidence`, { headers });
  const data3 = await res3.json();
  console.log(`[Test 3] Status: ${res3.status}`);
  console.log(`✓ Auto-resolved Selected Role: "${data3.selectedRole?.title}"`);
  console.log(`✓ Requirements count: ${data3.requirements?.length || 0}`);
  if (!data3.selectedRole || !data3.selectedRole.title.includes("AI/ML")) {
    throw new Error("Expected candidate's targetRole 'AIML ENGINEER' to be auto-resolved to 'AI/ML Engineer'.");
  }
  if (!data3.requirements || data3.requirements.length === 0) {
    throw new Error("Expected evidence requirements to be non-empty.");
  }
  for (const req of data3.requirements) {
    console.log(`   - Skill: ${req.name} [${req.requiredLevel}] (${req.evidence.length} employer signal(s))`);
  }

  // Test 4: Select AI/ML Engineer role explicitly via POST
  console.log("\n[Test 4] Selecting role via POST /api/candidate/role-evidence...");
  const res4 = await fetch(`${BASE_URL}/api/candidate/role-evidence`, {
    method: "POST",
    headers,
    body: JSON.stringify({ roleId: aimlRole.id }),
  });
  const data4 = await res4.json();
  if (!res4.ok) throw new Error(`Failed to select role: ${JSON.stringify(data4)}`);
  console.log(`✓ Selected role confirmed: "${data4.selectedRole.title}"`);
  console.log(`✓ Requirements loaded: ${data4.requirements.length} skills with employer evidence.`);

  // Test 5: Generate Diagnostic Assessment
  console.log("\n[Test 5] Generating Skill Diagnostic Assessment...");
  const res5 = await fetch(`${BASE_URL}/api/candidate/diagnostic/generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  });
  const data5 = await res5.json();
  if (!res5.ok) throw new Error(`Failed to generate diagnostic: ${JSON.stringify(data5)}`);
  console.log(`✓ Diagnostic generated: "${data5.title}" (Assessment ID: ${data5.assessmentId})`);
  console.log(`✓ Engine: ${data5.engine}, Question count: ${data5.questions?.length}`);
  if (!data5.questions || data5.questions.length === 0) {
    throw new Error("Expected questions to be generated.");
  }
  console.log(`  Sample Question 1: [${data5.questions[0].skill}] ${data5.questions[0].prompt}`);
  console.log(`  Options: ${data5.questions[0].options.join(" | ")}`);

  // Test 6: Submit Assessment
  console.log("\n[Test 6] Submitting Diagnostic Assessment answers...");
  const answers = Array(data5.questions.length).fill(0);
  const res6 = await fetch(`${BASE_URL}/api/candidate/diagnostic/submit`, {
    method: "POST",
    headers,
    body: JSON.stringify({ assessmentId: data5.assessmentId, answers }),
  });
  const data6 = await res6.json();
  if (!res6.ok) throw new Error(`Failed to submit diagnostic: ${JSON.stringify(data6)}`);
  console.log(`✓ Assessment scored successfully! Results:`);
  for (const r of data6.results || []) {
    console.log(`   - ${r.skill}: ${r.correct}/${r.total} (${r.percentage}%) [${r.status}]`);
  }
  console.log(`✓ Recommendations count: ${data6.recommendations?.length || 0}`);
  for (const rec of data6.recommendations || []) {
    console.log(`   * Course: "${rec.title}" by ${rec.provider} (Skill: ${rec.skill})`);
  }

  console.log("\n=======================================================");
  console.log("🎉 ALL TESTS PASSED! Career Goal & Evidence Fix Verified!");
  console.log("=======================================================");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Test failed:", err);
    process.exit(1);
  });
