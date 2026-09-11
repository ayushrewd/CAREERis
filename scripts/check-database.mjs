import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();
try {
  await prisma.$queryRawUnsafe('SELECT 1');
  console.log('Database reachable');
  console.log(await prisma.$queryRawUnsafe('SELECT migration_name, finished_at IS NOT NULL AS applied FROM _prisma_migrations'));
  console.log({ users: await prisma.user.count(), jobs: await prisma.job.count() });
} catch (error) {
  console.error(String(error.message).replace(/postgres(?:ql)?:\/\/\S+/g, '[redacted connection]'));
  process.exitCode = 1;
} finally { await prisma.$disconnect(); }
