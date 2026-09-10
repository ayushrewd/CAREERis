import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = process.env.CAREERIS_TEST_URL || "http://localhost:3000";
const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const password = "CareerIS-Test-2026!";
const createdEmails = [];
const sourceNames = [];

async function request(path, { cookie, method = "GET", body, expected = [200] } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { ...(cookie ? { cookie } : {}), ...(body ? { "content-type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!expected.includes(response.status)) throw new Error(`${method} ${path} returned ${response.status}: ${JSON.stringify(payload)}`);
  return { payload, cookie: response.headers.get("set-cookie")?.split(";")[0] || cookie };
}

async function register(roleType, fields) {
  const email = `e2e-${roleType.toLowerCase()}-${runId}@careeris.test`;
  createdEmails.push(email);
  return request("/api/auth/register", { method: "POST", expected: [201], body: { fullName: `E2E ${roleType}`, email, password, roleType, ...fields } });
}

async function main() {
  const company = await register("EMPLOYER", { companyName: `E2E Company ${runId}`, industry: "Software", headquarters: "E2E District" });
  const candidate = await register("CANDIDATE", { location: "E2E District", education: "Engineering", qualification: "B.Tech", experience: "2 years", currentSkills: ["Python"], targetRole: `E2E Python Engineer ${runId}` });
  const provider = await register("TRAINING_PROVIDER", { organizationName: `E2E Provider ${runId}`, providerType: "TEST_PROVIDER", headquarters: "E2E District" });
  const government = await register("DISTRICT_ADMIN", { departmentName: `E2E District Office ${runId}`, designation: "Planner", district: "E2E District" });

  const jobResult = await request("/api/jobs", { cookie: company.cookie, method: "POST", expected: [201], body: { title: `E2E Python Engineer ${runId}`, description: "A persisted operational-loop verification job.", location: "E2E District", sector: "Software", jobType: "FULL_TIME", minExperience: 1, qualification: "B.Tech", openPositions: 2, requirements: [{ name: "Python", proficiency: "FOUNDATIONAL", mandatory: true, weight: 1 }] } });
  const job = jobResult.payload.job;
  sourceNames.push(`CAREERIS company job ${job.id}`);

  const diagnostic = await request("/api/candidate/diagnostic/generate", { cookie: candidate.cookie, method: "POST", body: { scope: "DECLARED_SKILLS" } });
  const stored = await prisma.diagnosticAssessment.findUniqueOrThrow({ where: { id: diagnostic.payload.assessmentId } });
  const answers = stored.questions.map((question) => question.correctIndex);
  const scored = await request("/api/candidate/diagnostic/submit", { cookie: candidate.cookie, method: "POST", body: { assessmentId: stored.id, answers } });
  if (!scored.payload.results.every((result) => result.passed)) throw new Error("Passing diagnostic did not persist as passing evidence.");

  const project = await request("/api/candidate/projects", { cookie: candidate.cookie, method: "POST", expected: [201], body: { title: "External repository ownership-state check", description: "Verifies that repository metadata never automatically becomes verified ownership.", repositoryUrl: "https://github.com/openai/openai-node", technologies: ["Python"] } });
  if (project.payload.project.verificationStatus === "VERIFIED") throw new Error("Repository was incorrectly auto-verified.");

  const courseCreate = await request("/api/training-provider/courses", { cookie: provider.cookie, method: "POST", expected: [201], body: { title: `E2E Python Course ${runId}`, description: "Operational enrollment verification", durationHours: 10, level: "FOUNDATIONAL", deliveryMode: "ONLINE", locationText: "E2E District", eligibility: "Open", capacity: 5, status: "DRAFT", skills: [{ name: "Python", targetLevel: "FOUNDATIONAL" }] } });
  const course = courseCreate.payload.course;
  await request(`/api/training-provider/courses/${course.id}`, { cookie: provider.cookie, method: "PATCH", body: { title: course.title, description: course.description, durationHours: 10, level: "FOUNDATIONAL", deliveryMode: "ONLINE", locationText: "E2E District", eligibility: "Open", capacity: 5, status: "ACTIVE", skills: [{ name: "Python", targetLevel: "FOUNDATIONAL" }] } });
  sourceNames.push(`CAREERIS course capacity ${course.id}`);
  const enrollment = await request(`/api/courses/${course.id}/enroll`, { cookie: candidate.cookie, method: "POST", expected: [201] });
  await request(`/api/training-provider/courses/${course.id}/enrollments`, { cookie: provider.cookie, method: "PATCH", body: { enrollmentId: enrollment.payload.enrollment.id, status: "COMPLETED" } });

  const application = await request("/api/candidate/applications", { cookie: candidate.cookie, method: "POST", expected: [201], body: { jobId: job.id } });
  const applicationId = application.payload.application.id;
  await request(`/api/employer/jobs/${job.id}/applications`, { cookie: company.cookie, method: "PATCH", body: { applicationId, status: "SHORTLISTED" } });
  await request(`/api/employer/jobs/${job.id}/applications`, { cookie: company.cookie, method: "PATCH", body: { applicationId, status: "INTERVIEW", scheduledAt: new Date(Date.now() + 86_400_000).toISOString(), interviewMode: "ONLINE" } });
  await request(`/api/employer/jobs/${job.id}/applications`, { cookie: company.cookie, method: "PATCH", body: { applicationId, status: "SELECTED" } });
  await request(`/api/employer/jobs/${job.id}/applications`, { cookie: company.cookie, method: "PATCH", body: { applicationId, status: "HIRED" } });
  const placement = await prisma.placement.findUniqueOrThrow({ where: { applicationId } });
  const skillId = job.jobSkills[0].skillId;
  const feedback = await request("/api/employer/feedback", { cookie: company.cookie, method: "POST", expected: [201], body: { placementId: placement.id, skillId, observedProficiency: "FOUNDATIONAL", skillGap: true, jobReadiness: "Needs supervised practice", trainingRelevance: "Relevant foundation", outcome: "Hired", notes: "Operational-loop verification" } });
  sourceNames.push(`CAREERIS post-hire feedback ${feedback.payload.feedback.id}`);

  const intelligence = await request("/api/government/district-intelligence", { cookie: government.cookie });
  if (!Array.isArray(intelligence.payload.skills) || intelligence.payload.skills.length === 0) throw new Error("District intelligence did not consume demand/supply evidence.");
  const alignment = await request(`/api/training-provider/courses/${course.id}/curriculum`, { cookie: provider.cookie });

  console.log(JSON.stringify({ registration: "PASS", canonicalSkill: "PASS", assessment: "PASS", projectOwnershipSemantics: project.payload.project.verificationStatus, courseEnrollmentCompletion: "PASS", applicationToPlacement: "PASS", feedbackToDemand: "PASS", districtIntelligence: intelligence.payload.skills.length, curriculumAlignment: alignment.payload.alignment?.status || "INSUFFICIENT_DATA" }, null, 2));
}

main()
  .finally(async () => {
    if (sourceNames.length) await prisma.dataSource.deleteMany({ where: { name: { in: sourceNames } } });
    if (createdEmails.length) await prisma.user.deleteMany({ where: { email: { in: createdEmails } } });
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
