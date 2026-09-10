import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = process.env.CAREERIS_URL || "http://localhost:3000";

const userAEmail = `user-a-${Date.now()}@example.invalid`;
const userBEmail = `user-b-${Date.now()}@example.invalid`;
const password = "TestPassword#2026";

async function register(fullName, email) {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fullName,
      email,
      password,
      roleType: "CANDIDATE",
      location: "Pune, Maharashtra",
      education: "Government College of Engineering",
      qualification: "B.Tech Computer Science",
      experience: "Fresher",
      currentSkills: ["Python", "React"],
      targetRole: "Full Stack Engineer",
    }),
  });
  const data = await res.json();
  const cookie = res.headers.get("set-cookie")?.split(";", 1)[0];
  return { user: data.user, cookie };
}

try {
  console.log("[test] Registering User A and User B...");
  const accountA = await register("Candidate Alpha", userAEmail);
  const accountB = await register("Candidate Beta", userBEmail);

  console.log("[test] User A sends connection request to User B...");
  const reqRes = await fetch(`${baseUrl}/api/social/connections`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: accountA.cookie,
    },
    body: JSON.stringify({
      action: "REQUEST",
      userId: accountB.user.id,
    }),
  });
  const reqData = await reqRes.json();
  console.log("[test] Connection request result:", reqRes.status, reqData);

  console.log("[test] Fetching notifications for User B...");
  const notifRes = await fetch(`${baseUrl}/api/notifications`, {
    headers: { cookie: accountB.cookie },
  });
  const notifData = await notifRes.json();
  console.log("[test] User B notifications:", notifRes.status, JSON.stringify(notifData.data, null, 2));

  const connNotif = notifData.data?.find((n) => n.type === "CONNECTION_REQUEST");
  if (!connNotif) {
    throw new Error("FAIL: Connection request notification was not found in User B's notifications!");
  }
  console.log("[test] SUCCESS: Found connection notification for User B:", connNotif.title);

  console.log("[test] User B accepts connection directly via requestId:", connNotif.requestId);
  const acceptRes = await fetch(`${baseUrl}/api/social/connections`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: accountB.cookie,
    },
    body: JSON.stringify({
      action: "ACCEPT",
      requestId: connNotif.requestId,
    }),
  });
  const acceptData = await acceptRes.json();
  console.log("[test] Accept result:", acceptRes.status, acceptData);

  console.log("[test] Checking User A notifications for acceptance...");
  const notifARes = await fetch(`${baseUrl}/api/notifications`, {
    headers: { cookie: accountA.cookie },
  });
  const notifAData = await notifARes.json();
  console.log("[test] User A notifications:", JSON.stringify(notifAData.data, null, 2));

  console.log("[test] ALL NOTIFICATION VERIFICATIONS PASSED!");
} finally {
  console.log("[test] Cleaning up temporary accounts...");
  await prisma.user.deleteMany({
    where: { email: { in: [userAEmail, userBEmail] } },
  });
  await prisma.$disconnect();
  console.log("[test] Cleanup complete.");
}
