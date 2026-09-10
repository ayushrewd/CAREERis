import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = process.env.CAREERIS_URL || "http://localhost:3000";
const email = `auth-check-${Date.now()}@example.invalid`;
const password = "LocalAuthCheck#2026";

function expectStatus(label, response, expected) {
  if (response.status !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${response.status}`);
  }
  console.log(`[auth-check] ${label}: ${response.status}`);
}

try {
  const registration = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fullName: "Temporary Auth Check",
      email,
      password,
      roleType: "CANDIDATE",
      location: "Test Location",
      education: "Test Institution",
      qualification: "B.Tech - Computer Science and Engineering (CSE)",
      experience: "Fresher",
      currentSkills: ["Python", "Power BI"],
      targetRole: "AI/ML Engineer",
    }),
  });
  expectStatus("registration", registration, 201);
  const sessionCookie = registration.headers.get("set-cookie")?.split(";", 1)[0];
  if (!sessionCookie) throw new Error("registration: session cookie was not created");

  const currentUser = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: sessionCookie },
  });
  expectStatus("authenticated session", currentUser, 200);

  const duplicate = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fullName: "Temporary Auth Check",
      email,
      password,
      roleType: "CANDIDATE",
      location: "Test Location",
      education: "Test Institution",
      qualification: "B.Tech - Computer Science and Engineering (CSE)",
      experience: "Fresher",
      currentSkills: ["Python"],
      targetRole: "AI/ML Engineer",
    }),
  });
  expectStatus("duplicate email rejected", duplicate, 409);

  const wrongPassword = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password: "IncorrectPassword#2026", roleType: "CANDIDATE" }),
  });
  expectStatus("wrong password rejected", wrongPassword, 401);

  const login = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password, roleType: "CANDIDATE" }),
  });
  expectStatus("sign in", login, 200);
  console.log("[auth-check] All authentication checks passed.");
} finally {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
  console.log("[auth-check] Temporary account removed.");
}
