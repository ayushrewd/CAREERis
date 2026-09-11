import assert from 'node:assert/strict';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
import { PrismaClient } from '@prisma/client';

// Exercise local data only; do not create test accounts in production.
const baseUrl = process.env.CAREERIS_URL || 'http://localhost:3000';
if (!['localhost', '127.0.0.1'].includes(new URL(baseUrl).hostname)) throw new Error('Run this check against a local app.');
const prisma = new PrismaClient();
if (!process.env.DATABASE_URL || !['localhost', '127.0.0.1'].includes(new URL(process.env.DATABASE_URL).hostname)) throw new Error('Run this check against a local database.');
const tag = `backend-check-${Date.now()}`;
const emails = [0, 1, 2].map(i => `${tag}-${i}@example.invalid`);
const password = 'TemporaryBackendCheck#2026';
async function request(path, method = 'GET', data, cookie, expected = 200) {
  const response = await fetch(`${baseUrl}${path}`, { method, headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, ...(data ? { body: JSON.stringify(data) } : {}) });
  const rawText = await response.text();
  let body;
  try {
    body = JSON.parse(rawText);
  } catch {
    console.error(`Failed ${method} ${path} status=${response.status}: ${rawText.slice(0, 300)}`);
    throw new Error(`Failed to parse JSON on ${method} ${path}`);
  }
  assert.equal(response.status, expected, `${method} ${path}: ${JSON.stringify(body)}`);
  return { body, cookie: response.headers.get('set-cookie')?.split(';')[0] };
}
try {
  await request('/api/health');
  const employer = await request('/api/auth/register', 'POST', { fullName: 'Backend Check', email: emails[0], password, roleType: 'EMPLOYER', companyName: tag }, undefined, 201);
  const other = await request('/api/auth/register', 'POST', { fullName: 'Other Company', email: emails[1], password, roleType: 'EMPLOYER', companyName: `${tag}-other` }, undefined, 201);
  const candidate = await request('/api/auth/register', 'POST', { fullName: 'Candidate Check', email: emails[2], password, roleType: 'CANDIDATE', location: 'Pune', education: 'Test University', qualification: 'B.Tech', experience: 'Fresher', targetRole: 'Engineer', currentSkills: ['ML', 'Machine Learning', 'Python'] }, undefined, 201);
  const profile = await prisma.candidateProfile.findUnique({ where: { userId: candidate.body.user.id }, include: { declaredSkills: true } });
  assert.equal(profile.declaredSkills.length, 2, 'Aliases should not duplicate declared skills');
  const payload = { title: tag, description: 'An integration check job', location: 'Pune', openPositions: '2', minExperience: '0', maxExperience: '0', minSalaryINR: '0', maxSalaryINR: '', requirements: [{ name: 'ML', proficiency: 'INTERMEDIATE' }, { name: 'Machine Learning', proficiency: 'INTERMEDIATE' }, { name: 'Python', proficiency: 'ADVANCED' }] };
  await request('/api/jobs', 'POST', payload, undefined, 401);
  await request('/api/jobs', 'POST', payload, candidate.cookie, 403);
  await request('/api/jobs', 'POST', { ...payload, openPositions: '1.5' }, employer.cookie, 400);
  await request('/api/jobs', 'POST', { ...payload, minSalaryINR: 100, maxSalaryINR: 50 }, employer.cookie, 400);
  const published = await request('/api/jobs', 'POST', payload, employer.cookie, 201);
  assert.equal(published.body.job.jobSkills.length, 2);
  assert.equal(published.body.job.maxExperience, 0);
  assert.equal(published.body.job.minSalaryINR, 0);
  const mine = await request('/api/jobs?mine=1', 'GET', undefined, employer.cookie);
  assert(mine.body.jobs.some(job => job.id === published.body.job.id));
  assert.equal(mine.body.jobs.find(job => job.id === published.body.job.id).requirements.length, 2);
  const others = await request('/api/jobs?mine=1', 'GET', undefined, other.cookie);
  assert(!others.body.jobs.some(job => job.id === published.body.job.id));
  const publicJobs = await request(`/api/jobs?q=${tag}`);
  assert(publicJobs.body.jobs.some(job => job.id === published.body.job.id));
  await request('/api/auth/logout', 'POST', {}, employer.cookie);
  await request('/api/jobs', 'POST', payload, employer.cookie, 401);
  console.log('PASS: registration, canonical skills, publishing, persistence, public visibility, company isolation, validation, role checks and session revocation.');
} finally {
  const users = await prisma.user.findMany({ where: { email: { in: emails } }, include: { employerAccount: true } });
  const companies = users.flatMap(user => user.employerAccount?.companyId ? [user.employerAccount.companyId] : []);
  const jobs = await prisma.job.findMany({ where: { companyId: { in: companies } }, select: { id: true } });
  const jobIds = jobs.map(job => job.id);
  await prisma.dataSource.deleteMany({ where: { name: { in: jobIds.map(id => `CAREERIS company job ${id}`) } } });
  await prisma.job.deleteMany({ where: { id: { in: jobIds } } });
  await prisma.auditLog.deleteMany({ where: { userId: { in: users.map(user => user.id) } } });
  await prisma.user.deleteMany({ where: { email: { in: emails } } });
  await prisma.company.deleteMany({ where: { id: { in: companies } } });
  await prisma.$disconnect();
  console.log('Temporary test accounts and jobs removed.');
}
