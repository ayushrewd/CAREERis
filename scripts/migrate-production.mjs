import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const values = Object.fromEntries(readFileSync('.env.production.local', 'utf8').split(/\r?\n/).flatMap(line => {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  return match ? [[match[1], match[2].replace(/^"|"$/g, '')]] : [];
}));
const url = values.DATABASE_URL_UNPOOLED || values.POSTGRES_URL_NON_POOLING || values.DIRECT_URL;
if (!url || ['localhost', '127.0.0.1'].includes(new URL(url).hostname)) throw new Error('Production direct database URL required.');
const result = spawnSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'deploy'], {
  stdio: 'inherit', env: { ...process.env, DATABASE_URL: url, DIRECT_URL: url },
});
process.exit(result.status ?? 1);
